const MenuSvg = ({ openNavigation, toggleNavigation }) => {
  return (
    <button
      className="my-2 ml-auto lg:hidden hover-menu w-10 h-10 inline-flex items-center justify-center rounded-md focus:outline-none focus:ring-2 focus:ring-primary/60"
      onClick={toggleNavigation}
      aria-label={openNavigation ? 'Close menu' : 'Open menu'}
      aria-expanded={openNavigation ? 'true' : 'false'}
      aria-controls="mobile-menu"
    >
      <svg
        className="overflow-visible"
        width="24"
        height="24"
        viewBox="0 0 20 12"
        role="img"
        aria-hidden="true"
      >
        <rect
          className={`transition-all origin-center menu-rect ${
            openNavigation ? 'rotate-45' : ''
          } fill-black dark:fill-white`}
          y={openNavigation ? "5" : "0"}
          width="20"
          height="2"
          rx="1"
          transform={`rotate(${openNavigation ? "45" : "0"})`}
        />
        <rect
          className={`transition-all origin-center menu-rect ${
            openNavigation ? '-rotate-45' : ''
          } fill-black dark:fill-white`}
          y={openNavigation ? "5" : "10"}
          width="20"
          height="2"
          rx="1"
          transform={`rotate(${openNavigation ? "-45" : "0"})`}
        />
      </svg>
    </button>
  );
};

export default MenuSvg;
