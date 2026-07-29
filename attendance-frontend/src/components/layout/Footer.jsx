function Footer() {
  return (
    <footer className="footer">
      
      {/* Left */}
      <div className="footer-left">
        Design & Developed by 
        <span className="highlight"> Pratik and Team</span>
      </div>

      {/* Center (optional branding) */}
      <div className="footer-center">
        Attendance System
      </div>

      {/* Right */}
      <div className="footer-right">
        © {new Date().getFullYear()} All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;