import { Users } from "lucide-react";

export default function About() {
  return (
    <div className="container mx-auto px-8 py-12 pt-28 max-w-6xl">
      <h1 className="text-5xl font-bold mb-12 text-center text-primary">About Us</h1>

      <section className="mb-16 text-center">
        <h2 className="text-3xl font-semibold mb-6 text-secondary">Our Story</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          KrushiYantra was founded with the vision of revolutionizing agriculture through technology. Our dedicated team is passionate about bringing innovative solutions to farmers, helping them optimize their resources and improve productivity through cutting-edge automation and AI-driven insights.
        </p>
      </section>

      <section className="mb-16 text-center">
        <h2 className="text-3xl font-semibold mb-6 text-secondary">Our Mission</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Our mission is to empower farmers and agribusinesses with advanced technology solutions that enhance efficiency, sustainability, and profitability. We strive to create intuitive, data-driven tools that simplify agricultural operations and contribute to a more sustainable future.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-8 text-center text-secondary">Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <div key={member.name} className="bg-muted p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all">
              <div className="flex items-center justify-center w-24 h-24 bg-primary rounded-full mb-6 mx-auto">
                <Users className="text-primary-foreground" size={40} />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-primary">{member.name}</h3>
              <p className="text-lg text-muted-foreground">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const teamMembers = [
  { name: "Sahil Makandar", role: "Frontend Developer" },
  { name: "Suyash Soundatte", role: "Backend Developer" },
  { name: "Sandesh Patil", role: "ML Developer" },
  { name: "Shravani Tingre", role: "ML Developer" },
];
