'use client'

import React from 'react'
import Link from "next/link";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {authClient} from "@/lib/auth-client";


const Navbar = () => {

    const router = useRouter()
    const {data: session} = authClient.useSession();
    const user = session?.user

    return (
        <header className='navbar'>
            <nav>
                <Link href='/'>
                    <Image src='/assets/icons/logo.svg' alt='logo' width={32} height={32}/>
                    <h1 className='capitalize'>loom cast</h1>
                </Link>
                {user && (
                    <figure>
                        <button onClick={() =>
                            router.push(`/profile/${session?.user.id}`)}
                                className='cursor-pointer'>
                            <Image src={user.image || ''} alt='user' width={36} height={36}
                                   className='aspect-square rounded-full'/>
                        </button>
                        <button
                            onClick={async () => {
                                return await authClient.signOut({
                                    fetchOptions: {
                                        onSuccess: () => {
                                            redirect("/sign-in");
                                        },
                                    },
                                });
                            }}
                            className="cursor-pointer"
                        >
                            <Image
                                src="/assets/icons/logout.svg"
                                alt="logout"
                                width={24}
                                height={24}
                                className="rotate-180"
                            />
                        </button>

                    </figure>
                )}
            </nav>
        </header>
    )
}
export default Navbar
