/* Accepted catalogue text transferred from the three local catalogue notes. */
(() => {
  'use strict';
  function freeze(value) {
    if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
    return value;
  }
  const entries = [
  {
    "id": "fehu",
    "nameImage": "reconstructed *fehu; cattle, wealth [N, S].",
    "historicalRoots": "Old English Feoh links wealth with comfort and giving; Norwegian fé with family discord. [P: Feoh; Norwegian Fe.]",
    "themes": [
      "resources",
      "sharing",
      "security"
    ],
    "reflection": "Consider what sustains you and how you use it. Money may be relevant, but so may time, skills or support. Having something valuable can bring ease and responsibility together. Notice whether your way of keeping or sharing it supports your present priorities, or has become a source of tension.",
    "questions": [
      "What resource matters most in this situation?",
      "Where does giving feel generous, and where does it feel pressured?",
      "What would responsible use of what you have look like now?"
    ],
    "adaptationNote": "The wider resource categories are our metaphorical extension. This entry does not decide whether money is coming or going.",
    "backgroundName": "",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Fehu"
        },
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Feoh; Norwegian Fe."
        }
      ],
      "adaptation": []
    }
  },
  {
    "id": "uruz",
    "nameImage": "reconstructed *ūruz; aurochs [N, S].",
    "historicalRoots": "Old English Ur depicts a formidable wild bovine. Later Norwegian úr denotes dross; Icelandic úr denotes rain. [P: Ur; Norwegian Ur; Icelandic Úr.]",
    "themes": [
      "capacity",
      "resolve",
      "restraint"
    ],
    "reflection": "Look at the effort the situation asks of you and the strength you can realistically bring to it. Resolve may help you act, while force without direction may waste energy or strain a relationship. Consider whether the useful move is to commit, pace yourself, or hold back until you understand what you are meeting.",
    "questions": [
      "What capacity can you draw on here?",
      "Where would steady effort help more than a forceful push?",
      "What limit should you respect while taking action?"
    ],
    "adaptationNote": "We choose the reconstructed aurochs image as the anchor. The later Norse images are recorded as differences, not silently combined into one meaning. Capacity is a reflective theme, not a claim about the reader's health or physical strength.",
    "backgroundName": "",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Uruz"
        },
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Ur; Norwegian Ur; Icelandic Úr."
        }
      ],
      "adaptation": []
    }
  },
  {
    "id": "thurisaz",
    "nameImage": "reconstructed *þurisaz; giant/thurs [N, S].",
    "historicalRoots": "Norse þurs imagery is threatening; Old English Thorn describes painful sharpness. [P: Norwegian/Icelandic Thurs; Old English Thorn.]",
    "themes": [
      "resistance",
      "boundaries",
      "response"
    ],
    "reflection": "Consider where you meet friction, and what happens when you react to it. A boundary may protect something important, yet a defensive response can also keep an argument alive. Before pushing through or withdrawing, look at what is actually resisting you and what kind of response would serve the situation.",
    "questions": [
      "What boundary or obstacle is most relevant here?",
      "What are you reacting to, and what might deserve a pause?",
      "How could you respond firmly without adding needless conflict?"
    ],
    "adaptationNote": "These questions connect two distinct later images without equating their names. Do not label this rune simply \"Thor\" or make it a message of divine anger.",
    "backgroundName": "",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Thurisaz"
        },
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Norwegian/Icelandic Thurs; Old English Thorn."
        }
      ],
      "adaptation": []
    }
  },
  {
    "id": "ansuz",
    "nameImage": "reconstructed *ansuz; a god [N, S].",
    "historicalRoots": "Icelandic Óss evokes Óðinn; Old English Os concerns speech and wisdom. Norwegian óss instead uses an estuary image. [P: Icelandic Óss; Old English Os; Norwegian As.]",
    "themes": [
      "counsel",
      "expression",
      "understanding"
    ],
    "reflection": "Attend to the words and guidance shaping your view. Advice can open a useful perspective, but its value depends on how carefully you listen and judge it. Consider what needs saying, what needs hearing, and whether an assumption is being mistaken for something you actually know.",
    "questions": [
      "Whose words are influencing how you understand this?",
      "What conversation or question could bring greater clarity?",
      "What do you need to distinguish between advice, assumption and evidence?"
    ],
    "adaptationNote": "Speech and counsel draw especially on the later Old English witness. Mythic atmosphere may acknowledge Óðinn, while the reflection never claims he has spoken or approves of the reader.",
    "backgroundName": "",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Ansuz"
        },
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Icelandic Óss; Old English Os; Norwegian As."
        }
      ],
      "adaptation": []
    }
  },
  {
    "id": "raidho",
    "nameImage": "reconstructed *raiðō; riding, journey [S]; riding/wagon [N].",
    "historicalRoots": "Old English Rad contrasts imagining a ride with undertaking it; Icelandic Reið pairs a rider's pleasure with the horse's effort. [P: Rad; Icelandic Reid.]",
    "themes": [
      "movement",
      "coordination",
      "practical steps"
    ],
    "reflection": "Consider how an intention becomes a journey through actual choices. A direction can feel clear until the work of following it begins. Notice the pace, arrangements and other people involved. Moving forward may mean taking a manageable step, adjusting the route, or agreeing how to travel together.",
    "questions": [
      "What is the next practical step, rather than the whole imagined journey?",
      "Whose effort or cooperation does this movement depend on?",
      "What change of pace or arrangement would make progress more workable?"
    ],
    "adaptationNote": "Travel becomes a metaphor for action and coordination. The rune does not announce a trip or guarantee progress.",
    "backgroundName": "",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        },
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Raidho"
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Rad; Icelandic Reid."
        }
      ],
      "adaptation": []
    }
  },
  {
    "id": "kaunan",
    "nameImage": "reconstructed *kaunan, sore/boil [S]; museum form *kauna [N].",
    "historicalRoots": "Norse kaun concerns a sore; Old English Cen depicts a torch. These are distinct name/image traditions. [P: Norwegian/Icelandic Kaun; Old English Cen.]",
    "themes": [
      "attention",
      "care",
      "repair"
    ],
    "reflection": "Bring attention to a point of discomfort or a problem you have been working around. Something troublesome may deserve patient care rather than concealment or a hurried fix. Consider what you can understand more clearly, what needs tending, and whether help would make the next step easier.",
    "questions": [
      "What unresolved difficulty keeps drawing your attention?",
      "What would it mean to tend to it rather than work around it?",
      "What understanding, practical help or repair would be useful now?"
    ],
    "adaptationNote": "Recommend the sore image as this version's main anchor, with torch imagery documented as an alternative later witness. Do not translate the reconstructed name as an undisputed \"torch\" or silently add a second illumination reading. The discomfort can be a problem or relationship; drawing this rune does not diagnose illness. Display choice and reflection await review.",
    "backgroundName": "Also called Kenaz in modern readings.",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        },
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Kaunan"
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Norwegian/Icelandic Kaun; Old English Cen."
        }
      ],
      "adaptation": []
    }
  },
  {
    "id": "gebo",
    "nameImage": "reconstructed *gebō; gift [N, S].",
    "historicalRoots": "Old English Gyfu connects generosity with honour and support for those in need. [P: Gyfu.]",
    "themes": [
      "giving",
      "receiving",
      "reciprocity"
    ],
    "reflection": "Look at the exchange between you and others. An offered gift, favour or opportunity can strengthen a connection, while unspoken expectations can make the same exchange feel burdensome. Consider what you can freely offer, what you can accept, and what needs to be understood between those involved.",
    "questions": [
      "What are you giving or receiving in this situation?",
      "Which expectations have been spoken, and which have only been assumed?",
      "What would make this exchange feel freely chosen and fair?"
    ],
    "adaptationNote": "Reciprocity and expectations are our reflection on giving, not a promise of romance, partnership or reward. Do not invent a corresponding Younger Futhark poem entry for this rune.",
    "backgroundName": "",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Gebo"
        },
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Gyfu."
        }
      ],
      "adaptation": []
    }
  },
  {
    "id": "wunjo",
    "nameImage": "reconstructed *wunjō; joy [N, S].",
    "historicalRoots": "Old English Wynn associates joy with relief from hardship and sufficient prosperity. [P: Wynn.]",
    "themes": [
      "joy",
      "contentment",
      "belonging"
    ],
    "reflection": "Notice what gives you a sense of ease or connection, and what supports it. Contentment may be found in a small moment rather than a perfect outcome. Consider whether your idea of happiness fits your own needs, or whether you are trying to maintain an appearance that leaves little room for how you actually feel.",
    "questions": [
      "Where do you already find a little ease or genuine enjoyment?",
      "What makes you feel welcome or at home?",
      "What would support contentment without requiring everything to be perfect?"
    ],
    "adaptationNote": "Belonging and the contrast with appearances are our prompts. This entry does not announce that wishes will come true. Do not invent a corresponding Younger Futhark poem entry.",
    "backgroundName": "",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Wunjo"
        },
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Wynn."
        }
      ],
      "adaptation": []
    }
  },
  {
    "id": "hagalaz",
    "nameImage": "reconstructed *hagalaz; hail [S]; museum form *hagall [N].",
    "historicalRoots": "Old English Hægl depicts wind-driven hail melting into water; Norwegian hagall describes cold grain. [P: Haegl; Norwegian Hagall.]",
    "themes": [
      "disruption",
      "adaptation",
      "perspective"
    ],
    "reflection": "Consider how you respond when circumstances interrupt a plan. Some conditions are outside your control, while your next response may still be yours to choose. Look at what needs immediate attention, what can be adjusted, and whether treating a passing difficulty as permanent is making the situation harder to understand.",
    "questions": [
      "What has interrupted the way you expected this to unfold?",
      "What can you adapt, and what must you allow for?",
      "Which part needs attention now, and which can be reconsidered later?"
    ],
    "adaptationNote": "Disruption and adaptation are our extension of the weather image. The melting image prompts perspective; it does not guarantee that a present difficulty will end soon or that a disaster is approaching.",
    "backgroundName": "",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        },
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Hagalaz"
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Haegl; Norwegian Hagall."
        }
      ],
      "adaptation": []
    }
  },
  {
    "id": "nauthiz",
    "nameImage": "reconstructed *nauðiz; need, distress [S]; museum *naudhiR includes constraint [N].",
    "historicalRoots": "Old English Nyd presents distress that may help when heeded; Norwegian nauðr stresses limited choices. [P: Nyd; Norwegian Naudhr.]",
    "themes": [
      "need",
      "constraint",
      "priorities"
    ],
    "reflection": "Consider a need or limitation that asks for attention. Recognizing a constraint can help you choose where to spend effort, ask for support or change an expectation. Distinguish what is necessary from what merely feels urgent.",
    "questions": [
      "What need are you finding difficult to acknowledge?",
      "Which limitation can you work around, and which must you account for?",
      "What could you simplify or ask for help with?"
    ],
    "adaptationNote": "Retains the R2 sample's original wording. Priorities and asking for support are our modern prompts. Difficulty is not declared necessary, deserved or guaranteed to be beneficial.",
    "backgroundName": "",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        },
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Nauthiz"
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Nyd; Norwegian Naudhr."
        }
      ],
      "adaptation": []
    }
  },
  {
    "id": "isa",
    "nameImage": "reconstructed *īsaz; ice [S]; museum form *isaR [N].",
    "historicalRoots": "Old English Is describes beautiful, slippery ice; Icelandic íss includes danger in its frozen-water image. [P: Is; Icelandic Iss.]",
    "themes": [
      "pause",
      "caution",
      "assessment"
    ],
    "reflection": "Consider where movement has slowed and what the pause allows you to notice. Waiting can create room to assess a situation, but it can also become a way of avoiding a decision. Look at what is stable enough to rely on, what only appears secure, and what would help you take a considered next step.",
    "questions": [
      "Where has progress slowed or stopped?",
      "Is this pause useful, unavoidable, or becoming avoidance?",
      "What should you check before moving forward?"
    ],
    "adaptationNote": "Pause and assessment are our metaphors, not translations of an ancient divination rule. The entry makes no promise that a delay is protective or that stillness is always the right response.",
    "backgroundName": "",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        },
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Isa"
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Is; Icelandic Iss."
        }
      ],
      "adaptation": []
    }
  },
  {
    "id": "jera",
    "nameImage": "reconstructed *jēra; year [S]; museum form *jára [N].",
    "historicalRoots": "Old English Ger concerns seasonal fruitfulness; Icelandic ár pictures a good summer and thriving crops. [P: Ger; Icelandic Ár.]",
    "themes": [
      "cycles",
      "timing",
      "returns"
    ],
    "reflection": "Look at the cycle this situation belongs to. Something may be ready to gather, may still need tending, or may need a different approach before another cycle begins. Consider what has had time to develop and what you are expecting too soon.",
    "questions": [
      "What is beginning to show the results of earlier effort?",
      "Where would patience or consistent care help?",
      "What repeating pattern would you like to change?"
    ],
    "adaptationNote": "Retains the R2 sample's original wording. Harvest imagery supports our questions about effort and timing; it does not establish an exact waiting period, an inevitable reward or a literal translation of \"justice.\"",
    "backgroundName": "",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        },
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Jera"
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Ger; Icelandic Ár."
        }
      ],
      "adaptation": []
    }
  },
  {
    "id": "eihwaz",
    "nameImage": "reconstructed *īhwaz; yew [N, S]. Display Eihwaz is distinct from Ehwaz, the later horse rune in Elder order.",
    "historicalRoots": "Old English Eoh describes a firm, rooted yew with rough bark. [P: Eoh.]",
    "themes": [
      "endurance",
      "foundations",
      "support"
    ],
    "reflection": "Consider what helps you remain steady through a demanding situation. A useful foundation may be a habit, a relationship or a value you can return to. Endurance does not have to mean resisting every change: notice which supports still serve you and which have become rigid expectations.",
    "questions": [
      "What keeps you grounded when this becomes difficult?",
      "Which support could you strengthen or return to?",
      "Where would flexibility help you endure more wisely?"
    ],
    "adaptationNote": "The tree image anchors our questions about steadiness. No death prediction or compulsory death-and-rebirth interpretation is added. Later Norse ýr is also a yew name, but its place in the changed alphabet should not be mistaken for an unchanged Elder entry; the Old English witness is sufficient here.",
    "backgroundName": "",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Eihwaz"
        },
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Eoh."
        }
      ],
      "adaptation": []
    }
  },
  {
    "id": "perthro",
    "nameImage": "conventionally reconstructed *perþō; name meaning uncertain [N, S]. Display Perthro is a familiar convention, not a claim that one reconstruction spelling is settled.",
    "historicalRoots": "Old English Peorð depicts play and laughter among companions. [P: Peordh.] Jones reviews competing guesses without establishing a secure name translation. [J: pp. 98–99.]",
    "themes": [
      "play",
      "fellowship",
      "openness"
    ],
    "reflection": "Consider whether curiosity or shared enjoyment could change how you approach this situation. Leaving a little room to explore may help you notice possibilities that a rigid expectation hides. At the same time, distinguish an experiment you can afford from a decision that needs firmer information or clearer commitments.",
    "questions": [
      "Where could curiosity or play make your approach less rigid?",
      "Who might help you explore a possibility or enjoy the moment?",
      "What can you try freely, and what needs more information first?"
    ],
    "adaptationNote": "Recommend play/fellowship as the anchor supplied by the verse. Openness and experiments are our extensions. Historical uncertainty about a word is not proof that its ancient meaning was \"mystery.\" Do not present dice-cup, womb or fate as a settled literal translation, or supply gambling odds. No matching Younger poem entry is invented.",
    "backgroundName": "",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Perthro"
        },
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Peordh."
        },
        {
          "sourceId": "J",
          "locator": "pp. 98–99."
        }
      ],
      "adaptation": []
    }
  },
  {
    "id": "algiz",
    "nameImage": "conventional reconstructions *algiz / *elhaz are glossed elk in the checked tables [N, S], with uncertainty flagged here. Jones discusses the disputed later name and a marsh-plant interpretation. [J: pp. 99–100.]",
    "historicalRoots": "Old English Eolh-secg depicts a marsh plant that wounds someone who grasps it. [P: Eolh.]",
    "themes": [
      "caution",
      "boundaries",
      "discernment"
    ],
    "reflection": "Consider what deserves a more careful approach before you engage with it. A boundary can help you choose how close to come, what to disclose or what to take on. Look for the difference between a specific reason for caution and a habit of treating every unfamiliar situation as threatening.",
    "questions": [
      "What deserves a closer look before you reach for it?",
      "What boundary would help you engage thoughtfully?",
      "Is your caution responding to something specific, or to uncertainty itself?"
    ],
    "adaptationNote": "Recommend the plant/contact image as our reflective anchor, with elk/name uncertainty in the disclosure. Boundary-setting is our interpretation, not proof that the rune literally translates as protection or guarantees a divine shield. Thurisaz focuses on response to friction; this entry focuses on choosing how to engage.",
    "backgroundName": "",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Algiz"
        },
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        },
        {
          "sourceId": "J",
          "locator": "pp. 99–100."
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Eolh."
        }
      ],
      "adaptation": []
    }
  },
  {
    "id": "sowilo",
    "nameImage": "reconstructed *sōwilō; sun [N, S].",
    "historicalRoots": "Old English Sigel offers seafarers hope; Icelandic sól describes sunlight overcoming ice. [P: Sigel; Icelandic Sól.]",
    "themes": [
      "clarity",
      "direction",
      "hope"
    ],
    "reflection": "Notice what helps you see the situation more clearly and orient yourself within it. Hope can give you a reason to act, while certainty claimed too soon can hide what still needs checking. Consider which direction has become clearer and what practical step would let you follow it with your eyes open.",
    "questions": [
      "What is becoming easier to see or understand?",
      "What gives you a useful sense of direction?",
      "How can you support that hope with a concrete step?"
    ],
    "adaptationNote": "Clarity and direction are our extension of sun and seafaring imagery. The reflection makes no guarantee of victory, success or a favourable outcome, and assigns no deity's approval.",
    "backgroundName": "",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Sowilo"
        },
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Sigel; Icelandic Sól."
        }
      ],
      "adaptation": []
    }
  },
  {
    "id": "tiwaz",
    "nameImage": "reconstructed *tīwaz; the god Týr [N, S].",
    "historicalRoots": "Icelandic Týr names a one-handed god; Old English Tir depicts a faithful sign on its course. [P: Tyr; Tir.] The latter's identification is debated. [J: pp. 102–103.]",
    "themes": [
      "commitment",
      "fairness",
      "responsibility"
    ],
    "reflection": "Consider the principle you want your actions to follow, especially when keeping it asks something of you. Commitment can help you act consistently, while treating your own position as automatically right can make it harder to hear others. Look at what you have promised, whose interests are involved, and how you can answer for your next choice.",
    "questions": [
      "What principle or promise matters most here?",
      "What would a fair response require you to consider?",
      "What responsibility are you willing to take for your choice?"
    ],
    "adaptationNote": "Fairness and responsibility are our reflective themes, not a literal translation of the name. Do not equate the Old English verse unconditionally with Týr or a particular star. The entry does not predict victory or claim the god has judged the reader.",
    "backgroundName": "",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Tiwaz"
        },
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Tyr; Tir."
        },
        {
          "sourceId": "J",
          "locator": "pp. 102–103."
        }
      ],
      "adaptation": []
    }
  },
  {
    "id": "berkano",
    "nameImage": "reconstructed *berkanō; birchwood [S]; museum *berkana, birch [N].",
    "historicalRoots": "Icelandic Bjarkan evokes a leafy young tree; Old English Beorc describes abundant branches and shoots. [P: Bjarken; Beorc.] Jones explains why its tree description has also been read as poplar. [J: p. 103.]",
    "themes": [
      "growth",
      "nurturing",
      "conditions"
    ],
    "reflection": "Consider what is developing and what would help it grow at a workable pace. Care may mean giving attention, making room or protecting a fragile beginning. It may also mean noticing when your effort to help has become pressure to produce a result. Look at the conditions you can tend rather than demanding immediate progress.",
    "questions": [
      "What is beginning to develop in this situation?",
      "What conditions or care would support it?",
      "Where could less pressure allow more useful growth?"
    ],
    "adaptationNote": "Birch remains the main checked name gloss; the later botanical complication stays in the background disclosure. Growth and nurturing extend tree imagery to the reader's situation. No pregnancy or other specific life event is inferred from drawing this rune.",
    "backgroundName": "",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        },
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Berkano"
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Bjarken; Beorc."
        },
        {
          "sourceId": "J",
          "locator": "p. 103."
        }
      ],
      "adaptation": []
    }
  },
  {
    "id": "ehwaz",
    "nameImage": "reconstructed *ehwaz; horse [N, S]. Distinct from Eihwaz ᛇ, the yew rune at position 13.",
    "historicalRoots": "Old English Eh depicts a valued horse, riders' conversation and comfort for the restless. [P: Eh.]",
    "themes": [
      "cooperation",
      "trust",
      "coordination"
    ],
    "reflection": "Consider how progress depends on a relationship between those taking part. Trust becomes useful through what people actually do and understand together. Notice whether responsibilities, pace and expectations fit, or whether one side is carrying more than has been acknowledged. A small agreement may help more than assuming you are already working in step.",
    "questions": [
      "Who or what are you relying on to move this forward?",
      "What needs to be agreed so that expectations match?",
      "How could you build trust through a concrete action?"
    ],
    "adaptationNote": "Cooperation is our metaphorical extension of the horse/rider setting. It does not promise a partner or ideal teamwork. Unlike Raidho's route and practical-step emphasis, this entry focuses on the working relationship.",
    "backgroundName": "",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Ehwaz"
        },
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Eh."
        }
      ],
      "adaptation": []
    }
  },
  {
    "id": "mannaz",
    "nameImage": "reconstructed *mannaz; human/person [N, S].",
    "historicalRoots": "Old English Mann combines affection among kin with mortality; Icelandic maðr also joins human company and earthly existence. [P: Mann; Madr.]",
    "themes": [
      "interdependence",
      "perspective",
      "limits"
    ],
    "reflection": "Consider yourself as one person within a situation shaped by other people too. Your viewpoint matters, but it may not contain everything someone else sees or needs. Notice where you can offer help, where you need it, and what becomes easier when you allow yourself and others to have ordinary human limits.",
    "questions": [
      "Whose perspective have you not yet considered?",
      "Where could giving or accepting help change the situation?",
      "What expectation would become more realistic if you allowed for human limits?"
    ],
    "adaptationNote": "The Old English verse's mortality language has a Christian frame. Our questions address relationships and limits; drawing this rune does not predict death, betrayal or another person's intentions.",
    "backgroundName": "",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Mannaz"
        },
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Mann; Madr."
        }
      ],
      "adaptation": []
    }
  },
  {
    "id": "laguz",
    "nameImage": "reconstructed *laguz (Shell writes *laʒuz); water [S]. The museum uses the different form *laukaR with a water/liquid gloss [N]; preserve the spelling difference rather than imply identical reconstructions.",
    "historicalRoots": "Old English Lagu describes an unsettling voyage on rough water; Icelandic lögr evokes moving water. [P: Lagu; Lögr.]",
    "themes": [
      "uncertainty",
      "adaptability",
      "navigation"
    ],
    "reflection": "Consider how you navigate a situation that does not stay still or respond fully to your control. It may help to observe changing conditions before deciding how firmly to hold a course. Feelings can draw attention to something important, while a considered response also asks what you know, what you can check and what support would help.",
    "questions": [
      "What is changing faster than you can comfortably plan for?",
      "What are your feelings drawing your attention to, and what can you check?",
      "What adjustment or support would help you navigate this more steadily?"
    ],
    "adaptationNote": "Feelings and adaptability are our contemporary metaphors, not a translation of water as an ancient rule about intuition. The entry does not ask the reader to treat an impression as proof of a hidden fact.",
    "backgroundName": "",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        },
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Laguz"
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Lagu; Lögr."
        }
      ],
      "adaptation": []
    }
  },
  {
    "id": "ingwaz",
    "nameImage": "reconstructed *ingwaz; Ing, a named figure [N, S].",
    "historicalRoots": "Old English Ing recalls a figure among the East Danes who departs eastward with a following wagon. [P: Ing.] Jones discusses its relationship to later Yngvi/Frey traditions. [J: pp. 105–106.]",
    "themes": [
      "contribution",
      "transition",
      "continuity"
    ],
    "reflection": "Consider a transition in something you have helped build. What you carry forward can include work, learning or relationships; what you leave behind can also matter. Notice whether you need to finish, pass something on or begin using it, and what should remain dependable as roles or circumstances change.",
    "questions": [
      "What are you ready to finish, carry forward or pass on?",
      "Who else has contributed, or will be affected by the transition?",
      "What needs continuity while something else changes?"
    ],
    "adaptationNote": "Contribution and continuity are our reading of a remembered figure and departure, not translations of the name. Identifying every detail of the Old English Ing with Freyr goes beyond that verse. No fixed fertility, pregnancy or stored-energy prediction is added.",
    "backgroundName": "",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Ingwaz"
        },
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Ing."
        },
        {
          "sourceId": "J",
          "locator": "pp. 105–106."
        }
      ],
      "adaptation": []
    }
  },
  {
    "id": "dagaz",
    "nameImage": "reconstructed *dagaz (Shell writes *daʒaz); day [N, S].",
    "historicalRoots": "Old English Dæg presents daylight as a benefit shared by rich and poor, in a Christian frame. [P: Dæg.]",
    "themes": [
      "visibility",
      "renewal",
      "opportunity"
    ],
    "reflection": "Consider what a fresh view allows you to notice. A change in perspective may make an option visible without solving every difficulty around it. Look for a beginning you can actually use, and distinguish what has changed in the situation from what has changed in your understanding of it.",
    "questions": [
      "What can you see now that was less clear before?",
      "What useful opening, however small, could you act on?",
      "Has the situation changed, your understanding changed, or both?"
    ],
    "adaptationNote": "Renewal and opportunity extend the daylight image. No sudden breakthrough or inevitable happy ending is promised. Sowilo focuses on orientation and hope; Dagaz focuses on what becomes newly visible and usable.",
    "backgroundName": "",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Dagaz"
        },
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Dæg."
        }
      ],
      "adaptation": []
    }
  },
  {
    "id": "othala",
    "nameImage": "reconstructed forms *ōþalan / *ōþilan; inherited possession, homeland [S]; museum *oðila, inheritance [N].",
    "historicalRoots": "Old English Ethel values an estate enjoyed with rights and appropriate customs. [P: Ethel.]",
    "themes": [
      "inheritance",
      "belonging",
      "stewardship"
    ],
    "reflection": "Consider what has come to you from the people, places or habits that shaped your life. It may offer support, or carry expectations you need to reconsider. Look at what you want to keep, what you can change, and how your choices can help make a place or relationship worth belonging to.",
    "questions": [
      "What have you inherited in resources, habits or expectations?",
      "What would you like to preserve, and what would you like to change?",
      "What responsibility comes with the place or connection you value?"
    ],
    "adaptationNote": "Habits, expectations and stewardship are our broader metaphors. The entry does not announce a financial inheritance or establish a person's entitlement to property. Belonging is explored through the reader's lived relationships and choices.",
    "backgroundName": "",
    "sourceReferences": {
      "name": [
        {
          "sourceId": "S",
          "locator": "Appendix A, printed p. 149 (PDF page 162)"
        },
        {
          "sourceId": "N",
          "locator": "Iron Age name table · Othala"
        }
      ],
      "roots": [
        {
          "sourceId": "P",
          "locator": "Ethel."
        }
      ],
      "adaptation": []
    }
  }
];
  const sources = [
  {
    "id": "N",
    "title": "National Museum of Denmark · Runernes navne",
    "url": "https://natmus.dk/historisk-viden/temaer/runer/runernes-navne/",
    "edition": "Iron Age name table; reconstructed names and image glosses."
  },
  {
    "id": "S",
    "title": "Scott T. Shell · The Application of Peircean Semiotics to the Elder Futhark Tradition: Establishing Parameters of Magical Communication",
    "url": "https://escholarship.org/content/qt97r2v4j9/qt97r2v4j9.pdf",
    "edition": "2020 dissertation. Appendix A, printed p. 149 (PDF page 162); Appendix C, printed p. 151, for later Old English counterparts. Name comparison, not oracle rules."
  },
  {
    "id": "P",
    "title": "Rune poems · Bruce Dickins translation",
    "url": "https://en.wikisource.org/wiki/Rune_poems",
    "edition": "1915 translation; named Old English, Norwegian and Icelandic verses. Later comparative witnesses from different alphabets/contexts, not an Elder divination handbook."
  },
  {
    "id": "J",
    "title": "Frederick George Jones, Jr. · The Old English Rune Poem, an Edition",
    "url": "https://ufdcimages.uflib.ufl.edu/UF/00/09/78/30/00001/oldenglishrunepo00jonerich.pdf",
    "edition": "1967 dissertation. Printed pp. 98–100 (PDF pages 107–109) and pp. 102–106 (PDF pages 111–115); entry-specific locators below. Older general claims about divination origins are not adopted."
  }
];
  const ids = window.RuneVisuals.glyphs.map(rune => rune.id);
  if (entries.length !== 24 || new Set(entries.map(entry => entry.id)).size !== 24 ||
    !entries.every((entry,index) => entry.id === ids[index] && ['nameImage','historicalRoots','reflection','adaptationNote'].every(key => typeof entry[key] === 'string' && entry[key]) &&
      ['themes','questions'].every(key => entry[key].length === 3 && entry[key].every(text => typeof text === 'string' && text)) &&
      Object.values(entry.sourceReferences).flat().every(reference => sources.some(source => source.id === reference.sourceId) && reference.locator))) throw new Error('The accepted Rune catalogue is unavailable.');
  window.RuneCatalogue = freeze({version:1,entries,sources});
})();
