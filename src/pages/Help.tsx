import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  BookOpen, 
  MessageCircle, 
  Video, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Mail,
  Phone
} from "lucide-react";

const helpCategories = [
  {
    icon: BookOpen,
    title: "Getting Started",
    description: "Learn the basics of using Deriverse",
    articles: 12,
  },
  {
    icon: FileText,
    title: "Trading Guides",
    description: "Detailed guides on trading features",
    articles: 24,
  },
  {
    icon: Video,
    title: "Video Tutorials",
    description: "Watch step-by-step tutorials",
    articles: 8,
  },
  {
    icon: MessageCircle,
    title: "FAQs",
    description: "Frequently asked questions",
    articles: 36,
  },
];

const popularArticles = [
  { title: "How to import trades from exchanges", views: "2.4k" },
  { title: "Understanding P&L calculations", views: "1.8k" },
  { title: "Setting up risk management rules", views: "1.5k" },
  { title: "Connecting your wallet", views: "1.2k" },
  { title: "Export data to CSV", views: "980" },
];

const Help = () => {
  return (
    <DashboardLayout title="Help & Center" subtitle="Find answers and get support">
      <div className="space-y-8">
        {/* Search Section */}
        <div className="dashboard-card text-center py-12">
          <h2 className="text-2xl font-bold text-foreground mb-2">How can we help you?</h2>
          <p className="text-muted-foreground mb-6">Search our knowledge base or browse categories below</p>
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search for articles, guides, tutorials..." 
              className="pl-12 h-12 rounded-2xl text-base"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {helpCategories.map((category) => (
            <div
              key={category.title}
              className="dashboard-card hover:border-primary/50 transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                <category.icon className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{category.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
              <p className="text-xs text-muted-foreground">{category.articles} articles</p>
            </div>
          ))}
        </div>

        {/* Popular Articles & Contact */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Popular Articles */}
          <div className="lg:col-span-2 dashboard-card">
            <h3 className="font-semibold text-foreground mb-4">Popular Articles</h3>
            <div className="space-y-1">
              {popularArticles.map((article, index) => (
                <button
                  key={index}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-muted/80 transition-colors text-left group"
                >
                  <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                    {article.title}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{article.views} views</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </button>
              ))}
            </div>
            <Button variant="outline" className="mt-4 rounded-xl w-full">
              View All Articles
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Contact Support */}
          <div className="dashboard-card">
            <h3 className="font-semibold text-foreground mb-4">Contact Support</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            
            <div className="space-y-3">
              <Button variant="outline" className="w-full rounded-xl justify-start h-12">
                <Mail className="w-4 h-4 mr-3" />
                Email Support
              </Button>
              <Button variant="outline" className="w-full rounded-xl justify-start h-12">
                <MessageCircle className="w-4 h-4 mr-3" />
                Live Chat
              </Button>
              <Button variant="outline" className="w-full rounded-xl justify-start h-12">
                <Phone className="w-4 h-4 mr-3" />
                Schedule Call
              </Button>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-muted/50">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Support Hours:</span>
                <br />
                Mon - Fri: 9 AM - 6 PM EST
                <br />
                Weekend: Limited support
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Help;
