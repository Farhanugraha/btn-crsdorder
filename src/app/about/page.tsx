import Image from 'next/image';
import aboutPic from '../../../public/aboutus.png';

const About = () => {
  return (
    <div className="mt-8 flex flex-row gap-10 p-5">
      <Image
        src={aboutPic}
        alt="about picture"
        className="hidden max-w-[30%] md:block"
        placeholder="blur"
        blurDataURL={`${aboutPic}`}
        loading="lazy"
      />
      <div className="flex flex-col justify-center gap-10">
        <h1 className="text-center text-2xl font-bold">About Us</h1>
        <p>
          Selamat datang BTNers di Fooder, platform pemesanan makanan
          yang kami hadirkan untuk memudahkan Anda menikmati beragam
          hidangan favorit secara praktis dan cepat. Fooder dirancang
          untuk mendukung aktivitas BTNers dengan akses mudah ke
          pilihan kuliner berkualitas dari berbagai mitra restoran,
          menghadirkan pengalaman memesan makanan yang efisien,
          nyaman, dan menyenangkan dalam satu genggaman
        </p>
      </div>
    </div>
  );
};

export default About;
