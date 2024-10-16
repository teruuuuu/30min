import Link from "next/link";

export default function Title({ title, link = null, fontSize = "text-2xl  sm:text-3xl lg:text-4xl" }) {
    
    return (
      <h2 className={`font-black text-center ${fontSize}`}>
          {link && (
            <Link href={link}>{title}</Link>
          )}
          {!link && (
            <>{title}</>
          )}
      </h2>
    );
}
