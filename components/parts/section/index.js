export default function Section({ children, py="py-8 md:py-12 lg:py-20", bg="bg-white", px="px-16 lg:px-28 xl:px-52" }) {
    return (
      <section className={`${py} ${px} ${bg}`}>
        {children}
      </section>
    );
};