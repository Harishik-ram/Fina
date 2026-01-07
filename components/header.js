"use client";
import React from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Image from "next/image";
import Link from "next/link";
import { Button } from './ui/button';
import { LayoutDashboard, PenBox } from 'lucide-react';

const Header = () => {
  return (
    // 'fixed' takes this out of the normal document flow
    <div className='fixed top-0 w-full bg-gradient-to-r from-amber-50 to-yellow-50 backdrop-blur-md z-50 border-b border-amber-200 shadow-sm'>
      <nav className='container mx-auto px-4 py-4 flex items-center justify-between'>
        <Link href="/">
          <Image
            src={"/finalogo.png"}
            alt="fina logo"
            height={100}
            width={100}
            className="h-24 w-auto object-contain"
          />
        </Link>

        <div className='flex items-center space-x-4'>
          <SignedIn>
            <Link href={"/dashboard"}>
              <Button className="flex items-center gap-2 border-2 border-amber-500 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 hover:from-amber-200 hover:to-yellow-200 hover:text-amber-900 hover:border-amber-600">
                <LayoutDashboard size={20} />
                <span className='hidden md:inline'>Dashboard</span>
              </Button>
            </Link>

            <Link href={"/transaction/create"}>
              <Button className="flex items-center gap-2 gradient-button">
                <PenBox size={20} />
                <span className='hidden md:inline'>Add Transaction</span>
              </Button>
            </Link>
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl='/dashboard'>
              <Button variant="outline" className="border-amber-300 hover:bg-amber-50 hover:text-amber-700">
                Login
              </Button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton appearance={{
              elements: {
                userButtonAvatarBox: "w-12 h-12",
              },
            }} />
          </SignedIn>
        </div>
      </nav>
    </div>
  )
}

export default Header;