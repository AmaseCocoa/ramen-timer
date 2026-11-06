
export interface JanSplitResult {
  readonly country: string;
  readonly company: string;
  readonly product: string;
  readonly cd: string;
}

interface CapDBData {
  readonly jan: string;
  readonly name: string;
  readonly has_drain: boolean;
  readonly wait_seconds: number;
  readonly links: {
    readonly official: string;
  };
}

export const fetchJanCode = async (code: string): Promise<CapDBData | null> => {
  const separatedCode = separateJanCode(code);
  if (!separatedCode) return null

  const resp = await fetch(`https://raw.githack.com/AmaseCocoa/capdb-data/main/data/${separatedCode.country}/${separatedCode.company}/${separatedCode.product}.json`)
  if (resp.status !== 200) return null

  const data: CapDBData = await resp.json()
  return Object.freeze(data)
}

export const separateJanCode = (code: string): JanSplitResult | null => {
  if (code.length !== 13 || !/^\d+$/.test(code)) {
    return null;
  }

  const prefix5 = parseInt(code.substring(0, 5), 10);
  const cd = code.slice(-1);

  const isJapan = code.startsWith("45") || code.startsWith("49");
  if (!isJapan) {
    return null;
  }

  const country = code.substring(0, 3);

  let companyLength = 8;

  if (
    (prefix5 >= 49010 && prefix5 <= 49099) ||
    (prefix5 >= 49100 && prefix5 <= 49199) ||
    (prefix5 >= 49200 && prefix5 <= 49204)
  ) {
    companyLength = 6;
  }
  else if (
    (prefix5 >= 45700 && prefix5 <= 45709) ||
    (prefix5 >= 45731 && prefix5 <= 45735) ||
    (prefix5 >= 45800 && prefix5 <= 45809) ||
    (prefix5 >= 45825 && prefix5 <= 45826) ||
    (prefix5 >= 45894 && prefix5 <= 45898) ||
    (prefix5 >= 45951 && prefix5 <= 45959)
  ) {
    companyLength = 9;
  }

  const company = code.substring(3, 3 + companyLength);

  const product = code.substring(3 + companyLength, 12);

  return Object.freeze({
    country,
    company,
    product,
    cd
  } as const);
};
