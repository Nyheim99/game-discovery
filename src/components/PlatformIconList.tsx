import type { IconType } from 'react-icons'
import {
  FaWindows,
  FaPlaystation,
  FaXbox,
  FaApple,
  FaLinux,
  FaAndroid,
  FaGamepad,
} from 'react-icons/fa'
import { MdPhoneIphone } from 'react-icons/md'
import { BsGlobe } from 'react-icons/bs'
import type { ParentPlatform } from '@/services/api-client'

// Map RAWG's platform slug -> an icon component.
const iconMap: Record<string, IconType> = {
  pc: FaWindows,
  playstation: FaPlaystation,
  xbox: FaXbox,
  mac: FaApple,
  linux: FaLinux,
  android: FaAndroid,
  ios: MdPhoneIphone,
  nintendo: FaGamepad,
  web: BsGlobe,
}

interface Props {
  platforms: ParentPlatform[]
}

function PlatformIconList({ platforms }: Props) {
  return (
    <ul className="platform-icons">
      {platforms.map(({ platform }) => {
        const Icon = iconMap[platform.slug]
        if (!Icon) return null // skip platforms we don't have an icon for

        return (
          <li key={platform.id} title={platform.name}>
            <Icon aria-label={platform.name} />
          </li>
        )
      })}
    </ul>
  )
}

export default PlatformIconList
