import React, { useEffect, useState, useRef } from "react";
import mapdata from "../data/mapdata";
import { simplemaps_countrymap_mapinfo as mapinfo } from "../data/mapinfo";
import { useTheme } from "../contexts/ThemeContext";

const loadScript = (src) =>
  new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    } else {
      resolve();
    }
  });

const AfghanistanMap = () => {
  const { theme } = useTheme();
  const [selectedZone, setSelectedZone] = useState("");
  const mapInitialized = useRef(false);

  const initializeMap = React.useCallback(() => {
    if (window.simplemaps_countrymap) {
      window.simplemaps_countrymap.mapdata = JSON.parse(
        JSON.stringify(mapdata)
      );
      window.simplemaps_countrymap.mapinfo = { ...mapinfo };

      // Apply theme-specific styles
      const mapData = window.simplemaps_countrymap.mapdata;
      mapData.main_settings.auto_load = "yes";
      mapData.main_settings.width = "responsive";

      if (theme === "dark") {
        mapData.color_main = "#2d3748";
        mapData.color_background = "#1a202c";
        mapData.color_hover = "#4a5568";
        mapData.color_border = "#4a5568";
        mapData.color_text = "#e2e8f0";
      } else {
        mapData.color_main = "#f7fafc";
        mapData.color_background = "#ffffff";
        mapData.color_hover = "#e2e8f0";
        mapData.color_border = "#cbd5e0";
        mapData.color_text = "#2d3748";
      }

      if (!mapInitialized.current) {
        window.simplemaps_countrymap.load();
        mapInitialized.current = true;
      } else {
        window.simplemaps_countrymap.refresh();
      }
    }
  }, [theme]);

  useEffect(() => {
    loadScript("https://simplemaps.com/static/lib/jquery/jquery-1.11.3.min.js")
      .then(() =>
        loadScript(
          "https://simplemaps.com/static/lib/simplemaps/trials/maps/countrymap.js"
        )
      )
      .then(() => {
        initializeMap();
      })
      .catch((err) => {
        console.error("Failed to load map scripts", err);
      });
  }, [initializeMap]);

  // Update map when theme changes
  useEffect(() => {
    if (mapInitialized.current) {
      initializeMap();
    }
  }, [theme, initializeMap]);

  // Update highlighted zones
  useEffect(() => {
    if (!window.simplemaps_countrymap || !window.simplemaps_countrymap.mapdata)
      return;
    const states = window.simplemaps_countrymap.mapdata.state_specific;

    Object.keys(states).forEach((key) => {
      states[key].color = "default";
      states[key].hover_color = "default";
    });

    if (selectedZone) {
      Object.keys(states).forEach((key) => {
        if (states[key].zone === selectedZone) {
          states[key].color = "#FFCC00";
          states[key].hover_color = "#FFA500";
        }
      });
    }

    window.simplemaps_countrymap.load();
  }, [selectedZone]);

  return (
    <div
      style={{
        padding: 24,
        backgroundColor: theme === "dark" ? "#1a202c" : "#f9fafb",
        color: theme === "dark" ? "#e2e8f0" : "#2d3748",
        boxShadow:
          theme === "dark"
            ? "0 4px 6px rgba(0,0,0,0.3), 0 1px 3px rgba(0,0,0,0.2)"
            : "0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.06)",
        fontFamily: "'Vazirmatn', Tahoma, Arial, sans-serif",
        direction: "rtl",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <h2
        style={{
          marginBottom: 16,
          color: theme === "dark" ? "#e2e8f0" : "#222",
          fontWeight: "700",
          fontSize: "1.8rem",
          textAlign: "center",
        }}
      >
        زون ها و مراکز افغانستان
      </h2>
      <div
        style={{
          marginBottom: 20,
          textAlign: "center",
          display: "inline-block",
          width: "100%",
          maxWidth: 320,
        }}
      >
        <label
          htmlFor="zone-select"
          style={{
            display: "block",
            marginBottom: 8,
            fontWeight: "600",
            color: theme === "dark" ? "#CBD5E0" : "#444",
            fontSize: 16,
          }}
        >
          انتخاب زون
        </label>
        <select
          id="zone-select"
          onChange={(e) => setSelectedZone(e.target.value)}
          value={selectedZone}
          style={{
            width: "100%",
            padding: "10px 14px",
            fontSize: 16,
            borderRadius: 8,
            border: `1.5px solid ${theme === "dark" ? "#4A5568" : "#ccc"}`,
            backgroundColor: theme === "dark" ? "#2D3748" : "#fff",
            color: theme === "dark" ? "#E2E8F0" : "#222",
            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
            cursor: "pointer",
            transition:
              "border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "#FFCC00";
            e.target.style.outline = "none";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = theme === "dark" ? "#4A5568" : "#ccc";
            e.target.style.outline = "none";
          }}
        >
          <option value="">همه زون ها</option>
          <option value="north">زون شمال</option>
          <option value="northeast">زون شمال شرق</option>
          <option value="central">زون مرکز</option>
          <option value="capital">زون پایتخت</option>
          <option value="west">زون غرب</option>
          <option value="south">زون جنوب</option>
          <option value="east">زون شرق</option>
          <option value="southwest">زون جنوب غرب</option>
        </select>
      </div>

      <div
        id="map"
        style={{
          width: "100%",
          minHeight: 400, // smaller height
          maxWidth: 700, // optional max width to reduce horizontal size
          margin: "0 auto", // center horizontally if maxWidth applies
          borderRadius: 12,
          overflow: "hidden",
          boxShadow: "0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)",
          transition: "all 0.3s ease",
        }}
      />
    </div>
  );
};

export default AfghanistanMap;
