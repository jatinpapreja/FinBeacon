// constants/translations.ts

export type LanguageCode = "en" | "hi" | "de";
export type UserGroup = "teen" | "elder";

export interface QuizQuestion {
  q: string;
  options: string[];
}

interface QuestionsData {
  teen: QuizQuestion[];
  elder: QuizQuestion[];
}

interface AnswersData {
  teen: number[];
  elder: number[];
}

export interface TranslationEntry {
  appTitle: string;
  subtitle: string;
  langLabel: string;
  whoLabel: string;
  teen: string;
  elder: string;
  teensQuiz: string;
  eldersQuiz: string;
  next: string;
  restart: string;
  scoreLabel: string;
  copyright: string;
  questions: QuestionsData;
  answers: AnswersData;
}

const translations: Record<LanguageCode, TranslationEntry> = {
  en: {
    appTitle: "Wisdom Test",
    subtitle: "Financial Literacy for All Generations",
    langLabel: "Language:",
    whoLabel: "Who are you?",
    teen: "Teenager",
    elder: "Elder (60+)",
    teensQuiz: "Financial Literacy Quiz: Teens",
    eldersQuiz: "Financial Literacy Quiz: Elders (60+)",
    next: "Next",
    restart: "Restart",
    scoreLabel: "Your Score:",
    copyright: "© 2025 Financial Literacy for All",
    questions: {
      teen: [
        {
          q: "What is a budget?",
          options: [
            "A plan for spending and saving money",
            "A kind of bank account",
            "A requirement for taking loans",
            "A way to make money by investing",
          ],
        },
        {
          q: "If you get $20 allowance and save $5, how much do you spend?",
          options: ["$10", "$5", "$15", "$25"],
        },
        {
          q: "Which is a 'need', not a 'want'?",
          options: [
            "Latest smartphone",
            "Fancy shoes",
            "Healthy food",
            "Concert tickets",
          ],
        },
        {
          q: "Which will help you grow your savings over time?",
          options: [
            "Spending all you get",
            "Keeping money under your bed",
            "Putting money in a piggy bank",
            "Putting money in a savings account",
          ],
        },
        {
          q: "What does interest mean (in banking)?",
          options: [
            "Getting extra money for saving or paying extra when borrowing",
            "Only for adults",
            "Money you give as a gift",
            "None of the above",
          ],
        },
      ],
      elder: [
        {
          q: "What is the best way to plan finances for retirement?",
          options: [
            "Save regularly in a retirement fund",
            "Spend most savings immediately",
            "Rely only on government support",
            "Ignore investments",
          ],
        },
        {
          q: "Which type of insurance is most important for seniors?",
          options: [
            "Health Insurance",
            "Car Insurance",
            "Travel Insurance",
            "Home Insurance",
          ],
        },
        {
          q: "What is a pension?",
          options: [
            "A regular payment after retirement",
            "A loan to buy a house",
            "An investment in stocks",
            "A credit card offer",
          ],
        },
        {
          q: "How can you avoid financial scams?",
          options: [
            "Ignore unknown calls and messages",
            "Share personal info freely",
            "Respond to unsolicited offers",
            "Give money to strangers",
          ],
        },
        {
          q: "What should you do if you face financial hardship?",
          options: [
            "Contact a financial advisor",
            "Ignore the situation",
            "Borrow without plan",
            "Spend savings unnecessarily",
          ],
        },
      ],
    },
    answers: {
      teen: [0, 2, 2, 3, 0],
      elder: [0, 0, 0, 0, 0],
    },
  },
  hi: {
    appTitle: "स्मार्ट मनी",
    subtitle: "सभी पीढ़ियों के लिए वित्तीय साक्षरता",
    langLabel: "भाषा:",
    whoLabel: "आप कौन हैं?",
    teen: "किशोर",
    elder: "वरिष्ठ नागरिक (60+)",
    teensQuiz: "वित्तीय साक्षरता क्विज़: किशोर",
    eldersQuiz: "वित्तीय साक्षरता क्विज़: वरिष्ठ नागरिक (60+)",
    next: "अगला",
    restart: "फिर से शुरू करें",
    scoreLabel: "आपका स्कोर:",
    copyright: "© 2025 सभी के लिए वित्तीय साक्षरता",
    questions: {
      teen: [
        {
          q: "बजट क्या है?",
          options: [
            "पैसे खर्च और बचाने का एक प्लान",
            "एक प्रकार का बैंक खाता",
            "ऋण लेने की आवश्यकता",
            "निवेश कर पैसे कमाने का तरीका",
          ],
        },
        {
          q: "यदि आपको ₹20 पॉकेट मनी मिलती है और आप ₹5 बचाते हैं, तो आपने कितना खर्च किया?",
          options: ["₹10", "₹5", "₹15", "₹25"],
        },
        {
          q: "'जरूरत' कौन-सी है, 'चाहत' नहीं?",
          options: [
            "नई स्मार्टफोन",
            "फैंसी शूज़",
            "स्वस्थ भोजन",
            "कंसर्ट टिकट",
          ],
        },
        {
          q: "आप अपनी बचत को समय के साथ कैसे बढ़ा सकते हैं?",
          options: [
            "सारा पैसा खर्च करना",
            "पैसे को बिस्तर के नीचे रखना",
            "पिग्गी बैंक में पैसे डालना",
            "बचत खाते में पैसे रखना",
          ],
        },
        {
          q: "ब्याज (इंटरेस्ट) का क्या मतलब है (बैंकिंग में)?",
          options: [
            "बचाने पर अतिरिक्त पैसा पाना या कर्ज लेने पर अतिरिक्त चुकाना",
            "सिर्फ बड़ों के लिए",
            "गिफ्ट के रूप में दिया गया पैसा",
            "इनमें से कोई नहीं",
          ],
        },
      ],
      elder: [
        {
          q: "रिटायरमेंट के लिए वित्तीय योजना बनाने का सबसे अच्छा तरीका क्या है?",
          options: [
            "नियमित रूप से रिटायरमेंट फंड में बचत करना",
            "अधिकांश बचत तुरंत खर्च करें",
            "केवल सरकारी सपोर्ट पर निर्भर रहें",
            "निवेश को अनदेखा करें",
          ],
        },
        {
          q: "वरिष्ठ नागरिकों के लिए सबसे महत्वपूर्ण बीमा कौन-सा है?",
          options: ["स्वास्थ्य बीमा", "कार बीमा", "यात्रा बीमा", "घर का बीमा"],
        },
        {
          q: "पेंशन क्या है?",
          options: [
            "रिटायरमेंट के बाद नियमित पेमेंट",
            "घर खरीदने का लोन",
            "शेयर बाजार में निवेश",
            "क्रेडिट कार्ड ऑफर",
          ],
        },
        {
          q: "आप वित्तीय धोखाधड़ी से कैसे बच सकते हैं?",
          options: [
            "अनजान कॉल्स और मैसेज को अनदेखा करें",
            "व्यक्तिगत जानकारी सभी को दें",
            "अनचाहे ऑफर का जवाब दें",
            "अजनबियों को पैसे दें",
          ],
        },
        {
          q: "अगर आपको आर्थिक कठिनाई का सामना करना पड़े, तो क्या करना चाहिए?",
          options: [
            "वित्तीय सलाहकार से संपर्क करें",
            "स्थिति को नज़रअंदाज करें",
            "बिना योजना के उधार लें",
            "बिना सोच-विचार के बचत खर्च करें",
          ],
        },
      ],
    },
    answers: {
      teen: [0, 2, 2, 3, 0],
      elder: [0, 0, 0, 0, 0],
    },
  },
  de: {
    appTitle: "Smart Money",
    subtitle: "Finanzbildung für alle Generationen",
    langLabel: "Sprache:",
    whoLabel: "Wer bist du?",
    teen: "Jugendlicher",
    elder: "Senior (60+)",
    teensQuiz: "Finanzwissen Quiz: Jugendliche",
    eldersQuiz: "Finanzwissen Quiz: Senioren (60+)",
    next: "Weiter",
    restart: "Neu starten",
    scoreLabel: "Deine Punktzahl:",
    copyright: "© 2025 Finanzbildung für alle",
    questions: {
      teen: [
        {
          q: "Was ist ein Budget?",
          options: [
            "Ein Plan zum Ausgeben und Sparen von Geld",
            "Eine Art Bankkonto",
            "Eine Voraussetzung für Kredite",
            "Eine Möglichkeit, durch Investitionen Geld zu verdienen",
          ],
        },
        {
          q: "Wenn du 20€ Taschengeld bekommst und 5€ sparst, wie viel gibst du aus?",
          options: ["10€", "5€", "15€", "25€"],
        },
        {
          q: "Was ist ein 'Bedarf' und kein 'Wunsch'?",
          options: [
            "Das neueste Smartphone",
            "Schicke Schuhe",
            "Gesundes Essen",
            "Konzertkarten",
          ],
        },
        {
          q: "Wie kannst du über die Zeit dein Erspartes vermehren?",
          options: [
            "Alles ausgeben, was du bekommst",
            "Geld unter dem Bett aufbewahren",
            "Geld in ein Sparschwein legen",
            "Geld auf ein Sparkonto einzahlen",
          ],
        },
        {
          q: "Was bedeuten Zinsen (im Banking)?",
          options: [
            "Extra Geld bekommen beim Sparen oder zahlen beim Leihen",
            "Nur für Erwachsene",
            "Geld als Geschenk",
            "Keine der oben genannten",
          ],
        },
      ],
      elder: [
        {
          q: "Wie plant man am besten seine Finanzen für den Ruhestand?",
          options: [
            "Regelmäßig in Rentenfonds sparen",
            "Geld sofort ausgeben",
            "Nur auf staatliche Unterstützung verlassen",
            "Investitionen ignorieren",
          ],
        },
        {
          q: "Welche Versicherung ist für Senioren am wichtigsten?",
          options: [
            "Krankenversicherung",
            "Autoversicherung",
            "Reiseversicherung",
            "Hausversicherung",
          ],
        },
        {
          q: "Was ist eine Rente?",
          options: [
            "Regelmäßige Zahlung nach der Pension",
            "Kredit für ein Haus",
            "Aktieninvestition",
            "Kreditkartenangebot",
          ],
        },
        {
          q: "Wie verhindert man finanziellen Betrug?",
          options: [
            "Anrufe und Nachrichten ignorieren",
            "Persönliche Daten teilen",
            "Auf unerwünschte Angebote antworten",
            "Fremden Geld geben",
          ],
        },
        {
          q: "Was tun bei finanziellen Schwierigkeiten?",
          options: [
            "Finanzberater kontaktieren",
            "Ignorieren",
            "Unüberlegt Geld leihen",
            "Sparguthaben unbedacht ausgeben",
          ],
        },
      ],
    },
    answers: {
      teen: [0, 2, 2, 3, 0],
      elder: [0, 0, 0, 0, 0],
    },
  },
};

export default translations;
