const mapdata = {
  main_settings: {
    width: "300", //or 'responsive'
    background_color: "#FFFFFF",
    background_transparent: "yes",
    border_color: "#ffffff",
    pop_ups: "detect",
    
    state_description: "State description",
    state_color: "#88A4BC",
    state_hover_color: "#3B729F",
    state_url: "/herat",
    border_size: 1.5,
    all_states_inactive: "no",
    all_states_zoomable: "yes",
    
    location_description: "Location description",
    location_url: "",
    location_color: "#FF0067",
    location_opacity: 0.8,
    location_hover_opacity: 1,
    location_size: 25,
    location_type: "square",
    location_image_source: "frog.png",
    location_border_color: "#FFFFFF",
    location_border: 2,
    location_hover_border: 2.5,
    all_locations_inactive: "no",
    all_locations_hidden: "no",
    
    label_color: "#d5ddec",
    label_hover_color: "#d5ddec",
    label_size: 22,
    label_font: "Arial",
    hide_labels: "no",
    hide_eastern_labels: "no",
   
    zoom: "yes",
    manual_zoom: "yes",
    back_image: "no",
    initial_back: "no",
    initial_zoom: "-1",
    initial_zoom_solo: "no",
    region_opacity: 1,
    region_hover_opacity: 0.6,
    zoom_out_incrementally: "yes",
    zoom_percentage: 0.99,
    zoom_time: 0.5,
    
    popup_color: "white",
    popup_opacity: 0.9,
    popup_shadow: 1,
    popup_corners: 5,
    popup_font: "12px/1.5 Verdana, Arial, Helvetica, sans-serif",
    popup_nocss: "no",
    
    div: "map",
    auto_load: "yes",
    url_new_tab: "no",
    images_directory: "default",
    fade_time: 0.1,
    link_text: "View Website"
  },
  state_specific: {
    AFG1741: {
      name: "بادغیس",
      description: `
        <ul>
          <li>موسسه تعلیمات عالی بادغیس</li>
          <li>مرکز تربیت معلم بادغیس</li>
          <li>آموزشگاه فنی و حرفه‌ای بادغیس</li>
        </ul>
      `,
      zone: "northwest",
      color: "default",
      hover_color: "default",
      url: "default"
    },
    AFG1742: {
      name: "هرات",
      description: `
        <ul>
          <li>دانشگاه هرات</li>
          <li>موسسه تخنیکی هرات</li>
          <li>آموزشگاه زبان هرات</li>
        </ul>
      `,
      zone: "west",
    },
    AFG1743: {
      name: "بامیان",
      description: `
        <ul>
          <li>دانشگاه بامیان</li>
          <li>موسسه علوم انسانی بامیان</li>
          <li>مرکز آموزش عالی بامیان</li>
        </ul>
      `,
      zone: "central",
    },
    AFG1744: {
      name: "بلخ",
      description: `
        <ul>
          <li>دانشگاه بلخ</li>
          <li>موسسه علوم طبی بلخ</li>
          <li>آموزشگاه تجارت بلخ</li>
        </ul>
      `,
      zone: "north",
    },
    AFG1745: {
      name: "فاریاب",
      description: `
        <ul>
          <li>دانشگاه فاریاب</li>
          <li>مرکز تربیت معلم فاریاب</li>
          <li>آموزشگاه فنی فاریاب</li>
        </ul>
      `,
      zone: "northwest",
    },
    AFG1746: {
      name: "جوازجان",
      description: `
        <ul>
          <li>موسسه علوم جوازجان</li>
          <li>مرکز آموزش فنی جوازجان</li>
          <li>آموزشگاه تربیت معلم جوازجان</li>
        </ul>
      `,
      zone: "northwest",
    },
    AFG1747: {
      name: "غور",
      description: `
        <ul>
          <li>دانشگاه غور</li>
          <li>مرکز علوم طبیعی غور</li>
          <li>آموزشگاه فنی غور</li>
        </ul>
      `,
      zone: "west",
    },
    AFG1748: {
      name: "سرپل",
      description: `
        <ul>
          <li>دانشگاه سرپل</li>
          <li>مرکز آموزش عالی سرپل</li>
          <li>آموزشگاه زبان سرپل</li>
        </ul>
      `,
      zone: "northwest",
    },
    AFG1749: {
      name: "فراه",
      description: `
        <ul>
          <li>دانشگاه فراه</li>
          <li>مرکز علوم اجتماعی فراه</li>
          <li>آموزشگاه فنی فراه</li>
        </ul>
      `,
      zone: "west",
    },
    AFG1750: {
      name: "هلمند",
      description: `
        <ul>
          <li>دانشگاه هلمند</li>
          <li>مرکز تربیت معلم هلمند</li>
          <li>آموزشگاه فنی هلمند</li>
        </ul>
      `,
      zone: "southwest",
    },
    AFG1751: {
      name: "نیمروز",
      description: `
        <ul>
          <li>دانشگاه نیمروز</li>
          <li>مرکز آموزش عالی نیمروز</li>
          <li>آموزشگاه زبان نیمروز</li>
        </ul>
      `,
      zone: "southwest",
    },
    AFG1752: {
      name: "ارزگان",
      description: `
        <ul>
          <li>دانشگاه ارزگان</li>
          <li>مرکز علوم اجتماعی ارزگان</li>
          <li>آموزشگاه فنی ارزگان</li>
        </ul>
      `,
      zone: "south",
    },
    AFG1753: {
      name: "Uruzgan",
      description: `
        <ul>
          <li>دانشگاه ارزگان</li>
          <li>مرکز تربیت معلم ارزگان</li>
          <li>آموزشگاه زبان ارزگان</li>
        </ul>
      `,
      zone: "south",
    },
    AFG1754: {
      name: "کندهار",
      description: `
        <ul>
          <li>دانشگاه کندهار</li>
          <li>مرکز علوم طبیعی کندهار</li>
          <li>آموزشگاه فنی کندهار</li>
        </ul>
      `,
      zone: "south",
    },
    AFG1755: {
      name: "زابل",
      description: `
        <ul>
          <li>دانشگاه زابل</li>
          <li>مرکز آموزش عالی زابل</li>
          <li>آموزشگاه زبان زابل</li>
        </ul>
      `,
      zone: "south",
    },
    AFG1757: {
      name: "غزنی",
      description: `
        <ul>
          <li>دانشگاه غزنی</li>
          <li>مرکز علوم اجتماعی غزنی</li>
          <li>آموزشگاه فنی غزنی</li>
        </ul>
      `,
      zone: "central",
    },
    AFG1758: {
      name: "خوست",
      description: `
        <ul>
          <li>دانشگاه خوست</li>
          <li>مرکز تربیت معلم خوست</li>
          <li>آموزشگاه زبان خوست</li>
        </ul>
      `,
      zone: "east",
    },
    AFG1759: {
      name: "پکتیا",
      description: `
        <ul>
          <li>دانشگاه پکتیا</li>
          <li>مرکز آموزش عالی پکتیا</li>
          <li>آموزشگاه فنی پکتیا</li>
        </ul>
      `,
      zone: "east",
    },
    AFG1760: {
      name: "بدخشان",
      description: `
        <ul>
          <li>دانشگاه بدخشان</li>
          <li>مرکز علوم طبیعی بدخشان</li>
          <li>آموزشگاه زبان بدخشان</li>
        </ul>
      `,
      zone: "northeast",
    },
    AFG1761: {
      name: "نورستان",
      description: `
        <ul>
          <li>دانشگاه نورستان</li>
          <li>مرکز آموزش عالی نورستان</li>
          <li>آموزشگاه فنی نورستان</li>
        </ul>
      `,
      zone: "northeast",
    },
    AFG1762: {
      name: "کنر",
      description: `
        <ul>
          <li>دانشگاه کنر</li>
          <li>مرکز علوم اجتماعی کنر</li>
          <li>آموزشگاه زبان کنر</li>
        </ul>
      `,
      zone: "east",
    },
    AFG1763: {
      name: "کند",
      description: `
        <ul>
          <li>دانشگاه کند</li>
          <li>مرکز آموزش عالی کند</li>
          <li>آموزشگاه فنی کند</li>
        </ul>
      `,
      zone: "east",
    },
    AFG1764: {
      name: "ننگرهار",
      description: `
        <ul>
          <li>دانشگاه ننگرهار</li>
          <li>مرکز علوم طبیعی ننگرهار</li>
          <li>آموزشگاه زبان ننگرهار</li>
        </ul>
      `,
      zone: "east",
    },
    AFG1765: {
      name: "تخار",
      description: `
        <ul>
          <li>دانشگاه تخار</li>
          <li>مرکز علوم اجتماعی تخار</li>
          <li>آموزشگاه فنی تخار</li>
        </ul>
      `,
      zone: "north",
    },
    AFG1766: {
      name: "بغلان",
      description: `
        <ul>
          <li>دانشگاه بغلان</li>
          <li>مرکز آموزش عالی بغلان</li>
          <li>آموزشگاه زبان بغلان</li>
        </ul>
      `,
      zone: "north",
    },
    AFG1767: {
      name: "کابل",
      description: `
        <ul>
          <li>دانشگاه کابل</li>
          <li>موسسه علوم اجتماعی کابل</li>
          <li>آموزشگاه زبان کابل</li>
        </ul>
      `,
      zone: "capital",
    },
    AFG1768: {
      name: "کاپیسا",
      description: `
        <ul>
          <li>دانشگاه کاپیسا</li>
          <li>مرکز آموزش عالی کاپیسا</li>
          <li>آموزشگاه فنی کاپیسا</li>
        </ul>
      `,
      zone: "capital",
    },
    AFG1769: {
      name: "پروان",
      description: `
        <ul>
          <li>دانشگاه پروان</li>
          <li>مرکز علوم طبیعی پروان</li>
          <li>آموزشگاه زبان پروان</li>
        </ul>
      `,
      zone: "capital",
    },
    AFG1770: {
      name: "لغمان",
      description: `
        <ul>
          <li>دانشگاه لغمان</li>
          <li>مرکز آموزش عالی لغمان</li>
          <li>آموزشگاه فنی لغمان</li>
        </ul>
      `,
      zone: "east",
    },
    AFG1771: {
      name: "لوگر",
      description: `
        <ul>
          <li>دانشگاه لوگر</li>
          <li>مرکز علوم اجتماعی لوگر</li>
          <li>آموزشگاه زبان لوگر</li>
        </ul>
      `,
      zone: "south",
    },
    AFG1772: {
      name: "پروان",
      description: `
        <ul>
          <li>دانشگاه پروان</li>
          <li>مرکز علوم طبیعی پروان</li>
          <li>آموزشگاه زبان پروان</li>
        </ul>
      `,
      zone: "capital",
    },
    AFG1773: {
      name: "سمنگان",
      description: `
        <ul>
          <li>دانشگاه سمنگان</li>
          <li>مرکز آموزش عالی سمنگان</li>
          <li>آموزشگاه فنی سمنگان</li>
        </ul>
      `,
      zone: "north",
    },
    AFG1774: {
      name: "وردگ",
      description: `
        <ul>
          <li>دانشگاه وردگ</li>
          <li>مرکز علوم اجتماعی وردگ</li>
          <li>آموزشگاه زبان وردگ</li>
        </ul>
      `,
      zone: "central",
    },
    AFG3413: {
      name: "پکتیا",
      description: `
        <ul>
          <li>دانشگاه پکتیا</li>
          <li>مرکز آموزش عالی پکتیا</li>
          <li>آموزشگاه فنی پکتیا</li>
        </ul>
      `,
      zone: "east",
    }
  },
  locations: {
    "0": {
      lat: "34.516667",
      lng: "69.183333",
      name: "Kabul"
    }
  }
};

export default mapdata;
