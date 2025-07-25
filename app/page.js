import Image from 'next/image';
import Module1 from './components/Module1';
import Module2 from './components/Module2';

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <header className="row-start-1 flex gap-[24px] flex-wrap items-center justify-center">
        <h1 className="text-9xl">peep</h1>
      </header>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Module1 />
        <Module2 />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        footer
      </footer>
    </div>
  );
}
