import Image from 'next/image'
import logo from '../../../../public/logo-small.png'
import Link from "next/link";
//https://app.freelogodesign.org/design/156717c1bb694f55953757650fcace7f/edit
function Logo() {
  return (
    <Link href="/"
          className="flex items-center gap-1 z-10">
      <Image src={logo}
             opacity={90}
             style={{
                 width: '100px',
                 height: 'auto'
             }}
             alt="Eco-city logo" />
      <span className="text-4xl font-bold
      text-primary-10
      hover:text-accent-10 transition-colors">
        Eco-City
      </span>
    </Link>
  );
}

export default Logo;
