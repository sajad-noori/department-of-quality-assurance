import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const usersPerPage = 15;

  const roles = [
    { value: 'user', label: 'کاربر عادی' },
    { value: 'institute', label: 'مرکز آموزشی' },
    { value: 'admin', label: 'مدیر' },
    { value: 'employee', label: "کارمند"}
  ];

  const fetchUsers = async (retryCount = 0) => {
    try {
      setIsSearching(true);
      const response = await axios.get(`http://localhost:5000/api/users?page=${currentPage}&limit=${usersPerPage}&search=${searchQuery}`, {
        withCredentials: true
      });
      setUsers(response.data.users);
      setTotalPages(Math.ceil(response.data.total / usersPerPage));
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      if (retryCount < 3) {
        // Retry up to 3 times with exponential backoff
        setTimeout(() => {
          fetchUsers(retryCount + 1);
        }, Math.pow(2, retryCount) * 1000);
      } else {
        setError('خطا در دریافت اطلاعات کاربران. لطفا دوباره تلاش کنید.');
      }
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Debounced search function
  const debouncedFetchUsers = useCallback(
    debounce(() => {
      fetchUsers();
    }, 500),
    [currentPage, searchQuery]
  );

  useEffect(() => {
    debouncedFetchUsers();
    return () => {
      debouncedFetchUsers.cancel();
    };
  }, [currentPage, searchQuery]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRoleChange = (userId, newRole) => {
    setEditingUser({ id: userId, role: newRole });
  };

  const handleUpdateRole = async (userId) => {
    try {
      setUpdateError(null);
      setUpdateSuccess(null);
      
      const response = await axios.put(
        `http://localhost:5000/api/users/${userId}/role`,
        { role: editingUser.role },
        { withCredentials: true }
      );

      // Update the users list with the new role
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: editingUser.role } : user
      ));

      setUpdateSuccess('نقش کاربر با موفقیت بروزرسانی شد');
      setEditingUser(null);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setUpdateSuccess(null);
      }, 3000);
    } catch (err) {
      setUpdateError(err.response?.data?.message || 'خطا در بروزرسانی نقش کاربر');
      console.error('Error updating user role:', err);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">در حال بارگذاری...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-4" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '100%' }} className="px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">مدیریت کاربران</h1>
      
      <div style={{ width: '100%', maxWidth: '100%' }} className="mb-6">
        <div className="position-relative">
          <input
            type="text"
            placeholder="جستجو..."
            value={searchQuery}
            onChange={handleSearch}
            style={{ width: '100%' }}
            className="p-2 border rounded-lg text-right"
          />
          {isSearching && (
            <div className="position-absolute" style={{ left: '10px', top: '50%', transform: 'translateY(-50%)' }}>
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">در حال جستجو...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Success/Error Messages */}
      {updateSuccess && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {updateSuccess}
          <button type="button" className="btn-close" onClick={() => setUpdateSuccess(null)}></button>
        </div>
      )}
      {updateError && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {updateError}
          <button type="button" className="btn-close" onClick={() => setUpdateError(null)}></button>
        </div>
      )}

      {/* Users Table */}
      <div style={{ width: '100%', maxWidth: '100%' }} className="overflow-x-auto">
        <table style={{ width: '100%' }} className="table table-striped table-hover">
          <thead>
            <tr>
              <th>نام کاربر</th>
              <th>ایمیل</th>
              <th>نقش</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {editingUser?.id === user.id ? (
                    <select
                      className="form-select"
                      value={editingUser.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    >
                      {roles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    roles.find(r => r.value === user.role)?.label || user.role
                  )}
                </td>
                <td>
                  {editingUser?.id === user.id ? (
                    <div className="btn-group">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleUpdateRole(user.id)}
                      >
                        ذخیره
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingUser(null)}
                      >
                        انصراف
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setEditingUser({ id: user.id, role: user.role })}
                    >
                      ویرایش نقش
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav aria-label="Page navigation" className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                قبلی
              </button>
            </li>
            
            {[...Array(totalPages)].map((_, index) => (
              <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                بعدی
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default UserManagement; 