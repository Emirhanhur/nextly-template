import {
  PencilIcon,
  RocketLaunchIcon,
  EyeIcon,
  FaceSmileIcon,
  ChartBarSquareIcon,
  CursorArrowRaysIcon,
  DevicePhoneMobileIcon,
  AdjustmentsHorizontalIcon,
  SunIcon,
} from "@heroicons/react/24/solid";

import benefitOneImg from "../../public/img/benefit-one.png";
import benefitTwoImg from "../../public/img/benefit-two.png";

const benefitOne = {
  title: "Kurumsal Kimlik",
  desc: "Okuyucuya verilmek istenen mesajın mimarisi, görsel bütünlüğü ve mantıksal simgelemeyi estetik bir armonide gerçekleştirmek işin püf noktasıdır. Bizler Roinmax Reklam Ajansı ailesi olarak bütün gösel kuralları göz önünde bulundurarak sizlere özgü işler çıkartıyoruz.",
  image: benefitOneImg,
  bullets: [
    {
      title: "Müşteri Memnuniyeti",
      desc: "İlk maddeyi bir iki cümleyle kısaca açıklayın.",
      icon: <FaceSmileIcon />,
    },
    {
      title: "Vizyon",
      desc: "Reklam ve tasarım alanında yenilikçi çözümlerle fark yaratarak, bölgesel ölçekte güçlü, güvenilir ve akılda kalıcı bir marka olmak.",
      icon:<EyeIcon />,
    },
    {
      title: "Misyon",
      desc: "Müşterilemizin ihtiyaçlarını en doğru şekilde analiz edip, hem estetik hem işlevsel çözümler sunarak markalara değer katmak.",
      icon: <RocketLaunchIcon />,
    },
   
  ],
};

const benefitTwo = {
  title:"Kurumsal Kimlik",
  desc: "Kulağınıza en sevdiğiniz müziğin çaldığını hayal edin ve başka bir tarz müziğin en sevdiğiniz nakarat bölümüne eklendiğini düşünün bu nasıl sizi rahatsız ederse aynı şekilde görsel bütünlüğün bozulması da son kullanıcıyı rahatsız edecektir..",
  image: benefitTwoImg,
  bullets: [
    {
      title: "TASARIM ÖĞELERİ",
      desc: "Öğeler bir süreklilik ile döngü halindedirler böylelikle gözün tasarım üzerindeki hareketleri hesaplanarak konumlandırmalar gerçekleştirilir.",
      icon: <PencilIcon />,
    },
   
  ],
};


export {benefitOne, benefitTwo};
