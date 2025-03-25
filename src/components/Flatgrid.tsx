
import { Link } from 'react-router-dom';

export default function FlatsGrid() {
    const flats = [
      { name: "Worli", image: "https://res.cloudinary.com/dw7w2at8k/image/upload/v1742214536/pexels-tamjeedag-31069460_nbsr7g.jpg" },
      { name: "Lower Parel", image: "https://res.cloudinary.com/dw7w2at8k/image/upload/v1742214537/pexels-optical-chemist-340351297-15723780_dptdpv.jpg" },
      { name: "Bandra", image: "https://res.cloudinary.com/dw7w2at8k/image/upload/v1742214537/pexels-iamrizwan-1320663_s4n8zm.jpg" },
      { name: "Juhu", image: "https://res.cloudinary.com/dw7w2at8k/image/upload/v1742214539/pexels-jarod-16558193_ez5fv1.jpg" },
      { name: "BKC", image: "https://res.cloudinary.com/dw7w2at8k/image/upload/v1742214539/pexels-jarod-16572437_n68pwq.jpg" },
      { name: "Seawoods", image: "https://res.cloudinary.com/dw7w2at8k/image/upload/v1742214540/pexels-iamrizwan-1311046_rbu7of.jpg" },
      { name: "Goregaon", image: "https://res.cloudinary.com/dw7w2at8k/image/upload/v1742214552/pexels-drones-flown-540227711-16970120_csbd4c.jpg" },
      { name: "Kharghar", image: "https://res.cloudinary.com/dw7w2at8k/image/upload/v1742214553/pexels-drones-flown-540227711-17286413_jciq1e.jpg" },
    ];
  
    return (
      <div className="container mx-auto px-4 py-12 bg-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Popular Neighbourhoods</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {flats.map((flat, index) => (
            <Link 
              to={`/properties?city=${flat.name}`}
              key={index}
              className="group relative h-56 bg-cover bg-center rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]"
              style={{ backgroundImage: `url(${flat.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4">
                <div>
                  <p className="text-white/80 text-sm mb-1">Flats for sale in</p>
                  <h3 className="text-white text-xl md:text-2xl font-bold">{flat.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }
