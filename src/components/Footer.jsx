import React from "react";

function Footer() {
  return (
    /* mt-auto: Pushes footer to bottom in a flex-col container
       py-6: Vertical padding for a breathable look
    */
    <footer className="footer footer-center p-6 bg-base-300 text-base-content mt-auto border-t border-base-100/50">
      <aside>
        <p className="text-sm md:text-base font-medium opacity-80 tracking-wide">
          Copyright © {new Date().getFullYear()} -
          <span className="font-bold ml-1 text-primary italic">DEVtinder</span>.
          All rights reserved.
        </p>
      </aside>
    </footer>
  );
}

export default Footer;
