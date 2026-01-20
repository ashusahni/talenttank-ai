// C:\PERSONAL FILES\SANDBOX\WEB PROJECTS\TALENTTANK-AI\COMPONENTS\logo.tsx

import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="TalentTank Home">
      <Image
        // --- THE PATH IS CORRECTED HERE ---
        src="/assets/images/logo.jpg" 
        alt="TalentTank Logo"
        width={50} // Adjust width as needed for your navbar
        height={50}  // Adjust height to maintain aspect ratio
        priority 
        className="h-auto" 
      />
    </Link>
  );
}