import React from "react";
import { FaFacebookF, FaDiscord, FaGithub,FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';
import { FaPhoneAlt, FaHospital } from 'react-icons/fa';

export const footMenu = [
    {
        id: 1,
        title: "Shop & More",
        menu: [
            {
                id: 1,
                link: "Buy Medicines",
                path: "/buy-medicines",
                requiresAuth: true
            },
            {
                id: 2,
                link: "Disease Prediction",
                path: "/disease-prediction",
                requiresAuth: true
            },
            {
                id: 3,
                link: "Book an Appointment",
                path: "/doctors",
                requiresAuth: true
            }
        ]
    },
    {
        id: 2,
        title: "Ours",
        menu: [
            {
                id: 1,
                link: "About Us",
                path: "/about"
            },
            {
                id: 2,
                link: "Contact Us",
                path: "/contact"  
            },
            {
                id: 3,
                link: "Rate Us",
                path: "/feedback",
                requiresAuth: true
            },
            {
                id: 4,
                link: "Privacy Policies",
                path: "/privacy"
            },
        ]
    }
];

export const footSocial = [
    {
        id: 1,
        icon: <FaGithub />,
        cls: "github",
        path: "https://github.com/PratikMane0112/TelMedSphere",
        external: true
    },
    {
        id: 2,
        icon: <FaDiscord />,
        cls: "discord",
        path: "https://discord.gg/qsdDRKak28",
        external: true
    },
    {
        id: 3,
        icon: <IoMdMail />,
        cls: "mail",
        path: "mailto:contact@ai-medlab.com",
        external: true
    },
    {
        id: 4,
        icon: <FaPhoneAlt />,
        cls: "phone",
        path: "tel:+1234567890",
        external: true
    },
    {
        id: 5,
        icon: <FaHospital />,
        cls: "hospital",
        path: "/about",
        external: false
    }
];
