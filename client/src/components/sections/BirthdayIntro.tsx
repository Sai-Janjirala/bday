import Curtain from "../ui/Curtain";

interface BirthdayIntroProps {
  ready: boolean;
  onBegin: () => void;
}

export default function BirthdayIntro({ ready, onBegin }: BirthdayIntroProps) {
  return <Curtain ready={ready} onOpen={onBegin} />;
}