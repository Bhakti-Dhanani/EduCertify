export default function Footer() {
  return (
    <footer className="w-full py-6 md:py-8 border-t text-sm">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div className="col-span-2 space-y-2">
            <div className="flex space-x-3 pt-1">
              {['Twitter', 'LinkedIn', 'Facebook', 'YouTube'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="text-muted-foreground hover:text-foreground transition-colors text-xs"
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
          {[
            {
              title: "Product",
              links: ["Features", "Solutions", "Pricing", "Changelog"]
            },
            {
              title: "Resources",
              links: ["Documentation", "Guides", "Blog", "Webinars"]
            },
            {
              title: "Company",
              links: ["About", "Careers", "Contact", "Partners"]
            },
            {
              title: "Legal",
              links: ["Privacy", "Terms", "Security", "Cookies"]
            }
          ].map((section, index) => (
            <div key={index} className="space-y-2">
              <h3 className="text-xs font-medium">{section.title}</h3>
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t flex flex-col md:flex-row justify-between items-center text-xs">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} LearnHub. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-2 md:mt-0">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
