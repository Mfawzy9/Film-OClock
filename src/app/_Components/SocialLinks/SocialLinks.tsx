"use client";
import { FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";
import {
  facebookLink,
  instagramLink,
  tiktokLink,
  twitterLink,
  imdbLink,
} from "../../../../helpers/helpers";
import { FaFacebookSquare, FaImdb } from "react-icons/fa";
import { PExternalIds } from "@/app/interfaces/apiInterfaces/detailsInterfaces";

export const socialLinksMap = {
  instagram_id: {
    link: instagramLink,
    icon: <FaInstagram />,
  },
  facebook_id: {
    link: facebookLink,
    icon: <FaFacebookSquare />,
  },
  tiktok_id: {
    link: tiktokLink,
    icon: <FaTiktok />,
  },
  twitter_id: {
    link: twitterLink,
    icon: <FaXTwitter />,
  },
  imdb_id: {
    link: imdbLink,
    icon: <FaImdb />,
  },
};

interface SocialLinksProps {
  externalIds: PExternalIds;
  isPerson?: boolean;
}

const SocialLinks = ({ externalIds, isPerson = false }: SocialLinksProps) => {
  if (!externalIds || Object.keys(externalIds).length === 0) return null; // Prevents accessing properties on undefined

  const socialLinks = Object.entries(socialLinksMap)
    .map(([key, { link, icon }]) => {
      const id = externalIds[key as keyof PExternalIds];
      if (!id) return null;

      return { id, link, icon };
    })
    .filter(Boolean); // Removes null values

  if (socialLinks.length === 0) return null;

  return (
    <ul className="flex gap-3 text-2xl">
      {socialLinks.map((link, index) => (
        <a
          key={index}
          href={link?.link(link.id as string, isPerson)}
          target="_blank"
          className="hover:text-blue-400 lg:hover:scale-125 transition-all duration-200"
          rel="noopener noreferrer"
        >
          {link?.icon}
        </a>
      ))}
    </ul>
  );
};

export default SocialLinks;
