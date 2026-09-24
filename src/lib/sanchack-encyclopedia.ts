import type { Breed } from "./breeds";
import { ENCYCLOPEDIA_DATA } from "./sanchack-encyclopedia-data";

export type SanchackFaq = { q: string; a: string };

export type SanchackEncyclopedia = {
  intro: string;
  personality: string;
  living: string;
  activity: string;
  grooming: string;
  health: string;
  firstOwner: string;
  checklist: string[];
  faq: SanchackFaq[];
  headingVariants: {
    story: string;
    beforeLiving: string;
    lifestyle: string;
    health: string;
  };
};

export function getSanchackEncyclopedia(breed: Breed): SanchackEncyclopedia {
  return (
    ENCYCLOPEDIA_DATA[breed.slug] ||
    ENCYCLOPEDIA_DATA[breed.folder] ||
    fallbackEncyclopedia(breed)
  );
}

function fallbackEncyclopedia(breed: Breed): SanchackEncyclopedia {
  const pet = breed.kind === "cat" ? "고양이" : breed.kind === "shelter" ? breed.noun : "강아지";
  return {
    intro: `${breed.name}은 ${breed.tag}으로 알려진 ${pet}입니다. ${breed.temperament}`,
    personality: `${breed.name}의 성향은 보통 ${breed.temperament} 편이지만, 개체마다 차이가 있습니다.`,
    living: breed.homeNeed,
    activity: `${breed.size} 체구에 맞는 산책·놀이 시간을 미리 계획해 두면 좋습니다.`,
    grooming: `${breed.coat} 특성에 맞는 빗질·미용 루틴이 필요합니다.`,
    health: "정기 검진과 예방 접종 기록을 확인하고, 체중·치아·피부 상태를 평소에 살펴 주세요.",
    firstOwner: `${breed.tag} — 처음 ${pet}를 키우신다면 하루 관리 시간과 공간을 먼저 점검해 보세요.`,
    checklist: [
      "생활 공간·동선 점검",
      "예방 접종·건강 기록 확인",
      "사료·하네스·쿠션 등 기본 용품 준비",
      "병원·미용·돌봄 일정 상의",
    ],
    faq: [
      {
        q: `${breed.name}는 혼자 두어도 괜찮을까요?`,
        a: "품종 경향만으로 단정하기 어렵습니다. 남는 시간과 분리 훈련 계획을 함께 검토해 보세요.",
      },
      {
        q: "아파트에서도 키울 수 있나요?",
        a: breed.homeNeed,
      },
    ],
    headingVariants: {
      story: `${breed.name}는 어떤 ${pet}일까요?`,
      beforeLiving: "함께 살기 전에 알아둘 점",
      lifestyle: "이런 생활과 잘 맞을 수 있어요",
      health: "건강·관리 참고사항",
    },
  };
}
