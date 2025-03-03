import React from 'react';
import { AiFillInstagram, AiFillFacebook} from 'react-icons/ai';

const Footer = () => {
  return (
    <div className="footer-container">
      <p>2025 Beads Charm  All rights reserverd</p>
      <p className="icons">
        <a href="https://www.instagram.com/beads_charm_collections?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
        <AiFillInstagram />
        </a>
        <a href="https://www.facebook.com/beadscharm" target="_blank" rel="noopener noreferrer">
        <AiFillFacebook />
        </a>
      </p>
    </div>
  )
}

export default Footer