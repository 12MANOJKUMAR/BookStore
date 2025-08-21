const Footer = () => {
  return (
    <footer className="bg-zinc-800 text-zinc-300 text-center py-4">
      <p>
        © {new Date().getFullYear()}, Made with ❤️ by <span className="font-semibold">Manoj Kumar</span>
      </p>
    </footer>
  );
};

export default Footer;
