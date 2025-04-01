import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "@icons-pack/react-simple-icons";
import { LinkedIn } from "@mui/icons-material";

export default function ContactInfo() {
  return (
    <Card className="border-border/40 shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
            <p className="text-muted-foreground mb-6">
              Reach out to us for any questions about our premium textile
              products, custom orders, or business inquiries.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mr-3 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Address</h4>
                <p className="text-sm text-muted-foreground">
                  123 Textile Avenue
                  <br />
                  Fabric District
                  <br />
                  New York, NY 10001
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="h-5 w-5 mr-3 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Phone</h4>
                <p className="text-sm text-muted-foreground">
                  +1 (555) 123-4567
                  <br />
                  +1 (555) 765-4321
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Mail className="h-5 w-5 mr-3 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Email</h4>
                <p className="text-sm text-muted-foreground">
                  info@issatex.com
                  <br />
                  sales@issatex.com
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="h-5 w-5 mr-3 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Business Hours</h4>
                <p className="text-sm text-muted-foreground">
                  Monday - Friday: 9:00 AM - 6:00 PM
                  <br />
                  Saturday: 10:00 AM - 4:00 PM
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <SiFacebook className="h-5 w-5 text-primary" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <SiX className="h-5 w-5 text-primary" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <SiInstagram className="h-5 w-5 text-primary" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <LinkedIn className="h-5 w-5 text-primary" />
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
