window.ANNIVERSARY_GAME = {
  storageKey: "anniversary-qüst-progress",
  totalArtifacts: 9,
  finale: {
    cipherKey: 4,
    targetWord: "BARCELONA",
    encryptedWord: "XWNYAHKJW",
    chamberHeading: "Du hast gewonnen",
    chamberPrize: "Eine gemeinsame Reise für euch zwei",
    chamberDestinationLocked: "Verschlüsselt",
    chamberDestinationUnlocked: "Barcelona",
    decryptInstruction:
      "Alle 9 Artefakte sind gefunden und damit ist das Geschenk freigeschaltet. Herzlichen Glückwunsch, du hast eine Reise gewonnen, die Frage ist nur wohin?.",
    giftTitle: "Geschenk abholen",
    revealHeading: "Barcelona",
    revealSubheading: "Eür Jahrestagsgeschenk ist eine gemeinsame Reise.",
    revealCopy:
      "Du hast alle 9 Artefakte gefunden, den Schlüssel eingesetzt und das Ziel geknackt. Das Geschenk ist eine Reise für euch beide nach Barcelona. Pack die Koffer.",
  },
  levels: [
    {
      id: 1,
      chapter: "Level 1",
      kicker: "Niklas name me",
      title: "Nickname",
      description:
        "Das erste Kapitel führt ganz an den Anfang zurück, dorthin, wo der erste Kosename entstanden ist.",
      status: "playable",
      image: {
        src: "assets/photos/IMG_0877.JPG",
        alt: "Ruhiges Portrait am Tisch in warmer Stimmung",
      },
      gallery: [
        {
          src: "assets/photos/IMG_0864.JPG",
          alt: "Person mit Blumen im Sonnenuntergang",
        },
        {
          src: "assets/photos/IMG_0866.JPG",
          alt: "Grosses Lächeln im Gegenlicht",
        },
        {
          src: "assets/photos/IMG_0868.JPG",
          alt: "Selfie von euch beiden mit Skyline",
        },
      ],
      steps: [
        {
          prompt: "Was war der erste Kosename, den ich dir gegeben habe?",
          helper: "Eine Wortantwort reicht vollkommen aus.",
          hint: "Schau dir das Bild genau an",
          answerInput: {
            type: "text",
            label: "Kosename",
            placeholder: "Schreibe hier deine Antwort ...",
            buttonLabel: "Antwort prüfen",
            modeLabel: "Wortantwort",
          },
          validation: {
            mode: "oneOfText",
            accepted: ["herzblatt"],
          },
          failureMessage: "Komm schon ... das weißt du",
        },
      ],
      artifact: {
        icon: "✦",
        name: "herzblatt",
        encryptedLetter: "X",
        note:
          "Der erste Buchstabe wurde im Inventar versiegelt.",
      },
      reward: {
        title: "Erstes Artefakt gefunden",
        copy:
          "Das erste Level ist geschafft. Ein Buchstabe liegt jetzt sicher in deinem Inventar.",
      },
    },
    {
      id: 2,
      chapter: "Level 2",
      kicker: "Love Math",
      title: "Rechne uns aus",
      description:
        "Ein Kapitel für Kopfkino und Zahlenliebe. Erst kommt das Zwischenergebnis, dann der finale Rechenschritt.",
      status: "playable",
      image: {
        src: "assets/photos/IMG_0867.JPG",
        alt: "Verspieltes Selfie von euch beiden mit Panorama",
      },
      gallery: [
        {
          src: "assets/photos/IMG_0868.JPG",
          alt: "Kuscheliges Selfie mit Skyline",
        },
        {
          src: "assets/photos/IMG_0870.JPG",
          alt: "Gehaltene Hände bei einem Dinner",
        },
        {
          src: "assets/photos/IMG_0875.JPG",
          alt: "Kussfoto im Aufzug",
        },
      ],
      steps: [
        {
          prompt:
            "Anzahl der Tage die ein Jahr hat minus der Summe unserer beiden Geburtstage die wir bis jetzt im Leben hatten? ",
          helper:
            "Rechenaufgabe, also kein Taschenrechner.\nGib nur die Zahl ein.",
          hint: "Das erste Ergebnis ist eine dreistellige Zahl.",
          answerInput: {
            type: "number",
            label: "Zwischenergebnis",
            placeholder: "z. B. 69",
            buttonLabel: "Weiter zum Rechenschritt",
            modeLabel: "Zahlenantwort",
          },
          validation: {
            mode: "numberExact",
            value: 321,
          },
          successMessage:
            "Perfekt. Die korrekte Antwort ist 321. Rechne diese Zahl nun mal 2.",
          failureMessage:
            "Noch nicht ganz. Das erste Ergebnis ist dreistellig und liegt genau bei 321.",
        },
        {
          prompt: "Perfekt. Die korrekte Antwort ist 321. Rechne diese Zahl nun mal 2.",
          helper: "Nur die finale Zahl eingeben.",
          hint: "Verdopple einfach das Zwischenergebnis.",
          answerInput: {
            type: "number",
            label: "Finale Zahl",
            placeholder: "Schreibe hier die Zahl ...",
            buttonLabel: "Artefakt freischalten",
            modeLabel: "Zahlenantwort",
          },
          validation: {
            mode: "numberExact",
            value: 642,
          },
          failureMessage: "Fast. Es ist exakt das Doppelte von 321.",
        },
      ],
      artifact: {
        icon: "◇",
        name: "",
        encryptedLetter: "W",
        note:
          "Dieses Artefakt trägt einen verschlüsselten Buchstaben aus dem Zahlenkapitel.",
      },
      reward: {
        title: "Rechen-Artefakt gesichert",
        copy:
          "Du hast beide Rechenschritte gelöst und damit das zweite Artefakt freigeschaltet.",
      },
    },
    {
      id: 3,
      chapter: "Level 3",
      kicker: "Tierroulette",
      title: "Errate mein Tier",
      description:
        "Jetzt wird es verspielt. Mehrere Hinweise führen zu einem Tier, das dich direkt an mich denken lassen soll.",
      status: "playable",
      image: {
        src: "assets/photos/IMG_0866.JPG",
        alt: "Grosses lächelndes Portrait",
      },
      gallery: [
        {
          src: "assets/photos/IMG_0876.JPG",
          alt: "Shopping-Moment mit Sonnenbrille",
        },
        {
          src: "assets/photos/IMG_0869.JPG",
          alt: "Spiegelselfie mit pinkem Licht",
        },
        {
          src: "assets/photos/IMG_0873.JPG",
          alt: "Nahes Portrait mit grossem Lachen",
        },
      ],
      steps: [
        {
          prompt: "Errate, welches Tier ich bin.",
          helper:
            "Merkmale:\n1. Ich bin ein Wiederkäür.\n2. Ich ernähre mich hauptsächlich von Gras, Heu und Silage.\n3. Ich produziere eine Flüssigkeit, die du nicht verträgst.",
          hint: "Die Antwort muht dich praktisch schon an.",
          answerInput: {
            type: "text",
            label: "Tier",
            placeholder: "Welches Tier ist gemeint?",
            buttonLabel: "Antwort prüfen",
            modeLabel: "Wortantwort",
          },
          validation: {
            mode: "oneOfText",
            accepted: ["kuh", "eine kuh"],
          },
          failureMessage: "Fast. Es ist ein Tier, das auf einer Wiese ziemlich glücklich wäre.",
        },
      ],
      artifact: {
        icon: "✿",
        name: "Moo Charm",
        encryptedLetter: "N",
        note:
          "Ein weiterer verschlüsselter Buchstabe wurde im kleinen Moo-Charm eingeschlossen.",
      },
      reward: {
        title: "Tier-Artefakt freigeschaltet",
        copy:
          "Die richtige Antwort war gefunden und das dritte Artefakt ist jetzt im Inventar angekommen.",
      },
    },
    {
      id: 4,
      chapter: "Level 4",
      kicker: "DM Time Capsule",
      title: "First Text",
      description:
        "Dieses Kapitel testet Erinnerung statt Intuition. Es geht um den genaün Moment, an dem alles angefangen hat.",
      status: "playable",
      image: {
        src: "assets/photos/IMG_0875.JPG",
        alt: "Kussmoment im Aufzug",
      },
      gallery: [
        {
          src: "assets/photos/IMG_0869.JPG",
          alt: "Spiegelselfie mit pinkem Licht",
        },
        {
          src: "assets/photos/IMG_0872.JPG",
          alt: "Spiegelbild im Aufzug",
        },
        {
          src: "assets/photos/IMG_0876.JPG",
          alt: "Shopping-Selfie",
        },
      ],
      steps: [
        {
          prompt:
            "Ohne nachzusehen: An welchem Datum hast du mir das erste Mal auf Instagram geschrieben?",
          helper:
            "Schreibe das Datum im Stil Tag.Monat.Jahr.\nBeispiel: 01.01.2001",
          hint: "Es war Ende März 2025.",
          answerInput: {
            type: "text",
            label: "Datum",
            placeholder: "TT.MM.JJJJ",
            buttonLabel: "Antwort prüfen",
            modeLabel: "Datumsantwort",
          },
          validation: {
            mode: "dateExact",
            value: "2025-03-26",
          },
          failureMessage:
            "Noch nicht ganz. Denk an einen Tag ganz am Ende von März 2025.",
        },
      ],
      artifact: {
        icon: "✺",
        name: "Message Relic",
        encryptedLetter: "Y",
        note:
          "Das Nachrichten-Artefakt bewahrt den nächsten verschlüsselten Buchstaben auf.",
      },
      reward: {
        title: "DM-Artefakt geborgen",
        copy:
          "Die Erinnerung sitzt. Damit ist auch das vierte Artefakt freigeschaltet.",
      },
    },
    {
      id: 5,
      chapter: "Level 5",
      kicker: "MMA",
      title: "The Goat",
      description:
        "Hier geht es um Lieblingsfighter, Kampfnamen und eine Antwort, die ganz klar im Tipp versteckt ist.",
      status: "playable",
      image: {
        src: "assets/photos/vieh.JPG",
        alt: "Gemeinsames Spiegelbild im Gym",
      },
      gallery: [
        {
          src: "assets/photos/IMG_0871.JPG",
          alt: "Zweite Gym-Aufnahme",
        },
        {
          src: "assets/photos/IMG_0873.JPG",
          alt: "Lachendes Portrait",
        },
        {
          src: "assets/photos/IMG_0868.JPG",
          alt: "Selfie von euch beiden",
        },
      ],
      steps: [
        {
          prompt:
            "Welcher UFC Fighter ist mein Favorit?",
          helper: "Vorname und Nachname sind perfekt, der Nachname allein zählt aber auch.",
          hint: "Do Bronx",
          answerInput: {
            type: "text",
            label: "Fighter",
            placeholder: "Schreibe hier den Namen ...",
            buttonLabel: "Antwort prüfen",
            modeLabel: "Namensantwort",
          },
          validation: {
            mode: "oneOfText",
            accepted: ["charles oliveira", "oliveira", "charles"],
          },
          failureMessage: "Fast. Denk an den Fighter mit dem Nickname \"Do Bronx\".",
        },
      ],
      artifact: {
        icon: "✧",
        name: "Bronx Token",
        encryptedLetter: "A",
        note:
          "Auch dieses Kapitel hinterlässt einen verschlüsselten Buchstaben in deinem Inventar.",
      },
      reward: {
        title: "MMA-Artefakt freigeschaltet",
        copy:
          "Der richtige Fighter wurde erkannt und das fünfte Artefakt ist nun deins.",
      },
    },
    {
      id: 6,
      chapter: "Level 6",
      kicker: "Chaya Check",
      title: "Richtige Chaya",
      description:
        "Ein kurzes, freches Kapitel mit einer Popkultur-Antwort und maximaler Main-Character-Energie.",
      status: "playable",
      image: {
        src: "assets/photos/IMG_0869.JPG",
        alt: "Spiegelselfie mit pinkem Licht",
      },
      gallery: [
        {
          src: "assets/photos/IMG_0877.JPG",
          alt: "Portrait am Tisch",
        },
        {
          src: "assets/photos/IMG_0866.JPG",
          alt: "Lachendes Portrait",
        },
        {
          src: "assets/photos/IMG_0864.JPG",
          alt: "Person mit Blumen",
        },
      ],
      steps: [
        {
          prompt: "Welche Frau ist eine richtige Chaya, wie du es nennen würdest?",
          helper: "Chaya Chaya",
          hint: "Andrew and Tristan .....",
          answerInput: {
            type: "text",
            label: "Name",
            placeholder: "Schreibe hier den Namen ...",
            buttonLabel: "Antwort prüfen",
            modeLabel: "Namensantwort",
          },
          validation: {
            mode: "oneOfText",
            accepted: ["tate mcrä", "tate", "mcrä"],
          },
          failureMessage: "Fast. Denk an die Sängerin Tate McRä.",
        },
      ],
      artifact: {
        icon: "◈",
        name: "Chaya Crystal",
        encryptedLetter: "H",
        note:
          "Im Chaya Crystal ist der nächste verschlüsselte Buchstabe gespeichert.",
      },
      reward: {
        title: "Style-Artefakt erhalten",
        copy:
          "Die richtige Antwort sitzt und das sechste Artefakt ist nun freigeschaltet.",
      },
    },
    {
      id: 7,
      chapter: "Level 7",
      kicker: "Lo-Fi Link",
      title: "Unser erstes Bonding",
      description:
        "Dieses Kapitel ist leiser, softer und erinnert an das erste Thema, das euch näher gebracht hat.",
      status: "playable",
      image: {
        src: "assets/photos/skate.JPG",
        alt: "Ruhiges Portrait an einem Tisch",
      },
      gallery: [
        {
          src: "assets/photos/IMG_0867.JPG",
          alt: "Verspieltes Selfie von euch beiden",
        },
        {
          src: "assets/photos/IMG_0870.JPG",
          alt: "Gehaltene Hände am Tisch",
        },
        {
          src: "assets/photos/IMG_0868.JPG",
          alt: "Kuscheliges Selfie mit Skyline",
        },
      ],
      steps: [
        {
          prompt: "über welches Thema hast du das erste Mal mit mir gebondet?",
          helper: "Deep Bonding",
          hint: "Musik ....",
          answerInput: {
            type: "text",
            label: "Thema",
            placeholder: "Schreibe hier deine Antwort ...",
            buttonLabel: "Antwort prüfen",
            modeLabel: "Wortantwort",
          },
          validation: {
            mode: "oneOfText",
            accepted: ["lofi musik", "lofi", "lofi music"],
          },
          failureMessage: "Fast. Denk an entspannte Musik ohne viel Stress.",
        },
      ],
      artifact: {
        icon: "✷",
        name: "Lo-Fi Locket",
        encryptedLetter: "K",
        note:
          "Das Lo-Fi Locket schützt einen weiteren verschlüsselten Buchstaben.",
      },
      reward: {
        title: "Bonding-Artefakt gesichert",
        copy:
          "Die Erinnerung an eür erstes gemeinsames Thema hat das siebte Artefakt geöffnet.",
      },
    },
    {
      id: 8,
      chapter: "Level 8",
      kicker: "Der Ja-Moment",
      title: "Wo es passiert ist",
      description:
        "Fast am Ende angekommen führt dieses Kapitel zu dem Ort, an dem aus Fragezeichen ein klares Ja wurde.",
      status: "playable",
      image: {
        src: "assets/photos/IMG_0870.JPG",
        alt: "Gehaltene Hände in warmem Licht",
      },
      gallery: [
        {
          src: "assets/photos/IMG_0875.JPG",
          alt: "Kussfoto im Aufzug",
        },
        {
          src: "assets/photos/IMG_0864.JPG",
          alt: "Person mit Blumen",
        },
        {
          src: "assets/photos/IMG_0868.JPG",
          alt: "Selfie von euch beiden mit Skyline",
        },
      ],
      steps: [
        {
          prompt:
            "Wo habe ich dich gefragt, ob du meine Freundin werden möchtest?",
          helper: "Gesucht ist das Bundesland, nicht die genaü Stadt oder der genaü Ort.",
          hint: "Da gibt es auch paar Kühe",
          answerInput: {
            type: "text",
            label: "Ort",
            placeholder: "Schreibe hier den Ort ...",
            buttonLabel: "Antwort prüfen",
            modeLabel: "Wortantwort",
          },
          validation: {
            mode: "oneOfText",
            accepted: ["steiermark", "in der steiermark"],
          },
          failureMessage: "Fast. Gesucht ist das Bundesland.",
        },
      ],
      artifact: {
        icon: "✹",
        name: "Promise Pebble",
        encryptedLetter: "J",
        note:
          "Im Promise Pebble liegt der vorletzte verschlüsselte Buchstabe verborgen.",
      },
      reward: {
        title: "Promise-Artefakt freigeschaltet",
        copy:
          "Der Ja-Moment wurde richtig erinnert und das achte Artefakt ist jetzt offen.",
      },
    },
    {
      id: 9,
      chapter: "Level 9",
      kicker: "Kitchen Romance",
      title: "Food Baby",
      description:
        "Das letzte Kapitel ist lecker, verspielt und führt zum finalen Artefakt kurz vor der grossen Entschlüsselung.",
      status: "playable",
      image: {
        src: "assets/photos/drink.JPG",
        alt: "Person mit Blumen im Abendlicht",
      },
      gallery: [
        {
          src: "assets/photos/IMG_0877.JPG",
          alt: "Portrait am Tisch",
        },
        {
          src: "assets/photos/IMG_0870.JPG",
          alt: "Gehaltene Hände beim Dinner",
        },
        {
          src: "assets/photos/IMG_0873.JPG",
          alt: "Lachendes Portrait",
        },
      ],
      steps: [
        {
          prompt: "Was ist unser Lieblingsessen, wenn wir zusammen kochen?",
          helper: "Es ist ein Fast-Food-Klassiker in Taco-Form.",
          hint: "Die Antwort enthält Big Mac und Tacos in einem Namen.",
          answerInput: {
            type: "text",
            label: "Lieblingsessen",
            placeholder: "Schreibe hier deine Antwort ...",
            buttonLabel: "Finales Artefakt sichern",
            modeLabel: "Wortantwort",
          },
          validation: {
            mode: "oneOfText",
            accepted: ["big mac tacos", "big mac taco"],
          },
          failureMessage:
            "Fast. Denk an eine selbstgemachte Mischung aus Big Mac und Tacos.",
        },
      ],
      artifact: {
        icon: "✪",
        name: "Taco Talisman",
        encryptedLetter: "W",
        note:
          "Das letzte Artefakt vervollständigt dein Set aus verschlüsselten Buchstaben.",
      },
      reward: {
        title: "Finales Artefakt gesichert",
        copy:
          "Alle 9 Kapitel sind geschafft. Jetzt besitzt du das komplette Set an verschlüsselten Buchstaben.",
      },
    },
  ],
};
