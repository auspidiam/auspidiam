"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
return ( <main className="relative flex flex-1 w-full items-center justify-center overflow-hidden bg-white">
{/* Back home link */} <Link
     href="/"
     className="absolute top-8 left-8 flex items-center gap-2 text-sm text-black hover:opacity-70"
   > <ArrowLeft size={16} /> <span>back home</span> </Link>

```
  {/* Centered title */}
  <h1 className="text-6xl font-bold tracking-tight text-black text-center">About.</h1>
</main>
```

);
}
