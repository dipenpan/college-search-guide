import React from "react";
import { Routes, Route, NavLink, Outlet } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Search from "./pages/Search.jsx";
import Programs from "./pages/Programs.jsx";
import University from "./pages/University.jsx";
import Resources from "./pages/Resources.jsx";

const navClass = ({ isActive }) => (isActive ? "nav-link is-active" : "nav-link");

function SkipLink() {
  return <a href="#main" className="skip-link">Skip to content</a>;
}

function Header() {
  const [open, setOpen] = React.useState(false);
  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);

  return (
    <header className="site-header" role="banner">
      <div className="container header-inner">
        <NavLink to="/" className="brand" aria-label="College Guide home" onClick={close}>
          🎓 College Guide
        </NavLink>

        <nav className="nav" aria-label="Primary">
          <NavLink to="/search" className={navClass}>Universities</NavLink>
          <NavLink to="/programs" className={navClass}>Programs</NavLink>
          <NavLink to="/resources" className={navClass}>Resources</NavLink>
        </nav>

        <button
          type="button"
          className="hamburger"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={toggle}
        >
          ☰
        </button>
      </div>

      {open && (
        <div className="container mobile-nav" role="menu">
          <NavLink to="/search" className={navClass} onClick={close}>Universities</NavLink>
          <NavLink to="/programs" className={navClass} onClick={close}>Programs</NavLink>
          <NavLink to="/resources" className={navClass} onClick={close}>Resources</NavLink>
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container footer-inner">
        <p>© 2025 College Guide</p>
      </div>
    </footer>
  );
}

function Layout() {
  return (
    <div className="app">
      <SkipLink />
      <Header />
      <main id="main" className="container" role="main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/u/:id" element={<University />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="*" element={<div>Page not found</div>} />
      </Route>
    </Routes>
  );
}