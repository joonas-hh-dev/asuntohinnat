import { useState, useEffect } from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import "../styles/help.css";

export default function Help({ children }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null);

  const isMobile = window.innerWidth <= 600;

  const updateCoords = (target) => {
    const rect = target.getBoundingClientRect();
    setCoords({
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    });
  };

  const handleClick = (e) => {
    e.stopPropagation();
    updateCoords(e.currentTarget);
    setOpen((prev) => !prev);
  };

  const handleMouseEnter = (e) => {
    if (isMobile) return; // mobiilissa EI hoveria
    updateCoords(e.currentTarget);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    if (isMobile) return; // mobiilissa ei hover-sulkemista
    setOpen(false);
  };

  // suljetaan tooltip kun klikataan muualla sivulla
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [open]);

  return (
    <span
      className="help-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="help-button" onClick={handleClick}>
        <InfoOutlinedIcon fontSize="inherit" />
      </button>

      {open && coords && (
        <div
          className="help-box"
          style={{
            top: coords.top,
            left: coords.left,
          }}
        >
          {children}
        </div>
      )}
    </span>
  );
}
