/*
    =============================================================================
    *****************************************************************************
    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at https://mozilla.org/MPL/2.0/.

    Software distributed under the License is distributed on an "AS IS"
    basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
    License for the specific language governing rights and limitations
    under the License.

    The Original Code is jsAvroPhonetic

    The Initial Developer of the Original Code is
    Rifat Nabi <to.rifat@gmail.com>

    Copyright (C) OmicronLab (http://www.omicronlab.com). All Rights Reserved.


    Contributor(s): ______________________________________.

    *****************************************************************************
    =============================================================================
*/

var OmicronLab = {};
OmicronLab.Avro = {};

OmicronLab.Avro.Phonetic = {
    parse: function(input) {
        var fixed = this.fixString(input);
        var output = "";
        for(var cur = 0; cur < fixed.length; ++cur) {
            var start = cur, end = cur + 1, prev = start - 1;
            var matched = false;

            for(var i = 0; i < this.data.patterns.length; ++i) {
                var pattern = this.data.patterns[i];
                end = cur + pattern.find.length;
                if(end <= fixed.length && fixed.substring(start, end) == pattern.find) {
                    prev = start - 1;
                    if(typeof pattern.rules !== 'undefined') {
                        for(var j = 0; j < pattern.rules.length; ++j) {
                            var rule = pattern.rules[j];
                            var replace = true;

                            var chk = 0;
                            for(var k=0; k < rule.matches.length; ++k) {
                                var match = rule.matches[k];

                                if(match.type === "suffix") {
                                    chk = end;
                                } 
                                // Prefix
                                else {
                                    chk = prev;
                                }

                                // Handle Negative
                                if(typeof match.negative === 'undefined') {
                                    match.negative = false;
                                    if(match.scope.charAt(0) === '!') {
                                        match.negative = true;
                                        match.scope = match.scope.substring(1);
                                    }
                                }

                                // Handle empty value
                                if(typeof match.value === 'undefined') match.value = '';

                                // Beginning
                                if(match.scope === "punctuation") {
                                    if(
                                        ! (
                                            ((chk < 0) && (match.type === "prefix")) || 
                                            ((chk >= fixed.length) && (match.type === "suffix")) || 
                                            this.isPunctuation(fixed.charAt(chk))
                                        ) ^ match.negative
                                    ) {
                                        replace = false;
                                        break;
                                    }
                                }
                                // Vowel
                                else if(match.scope === "vowel") {
                                    if(
                                        ! (
                                            (
                                                (chk >= 0 && (match.type === "prefix")) || 
                                                (chk < fixed.length && (match.type === "suffix"))
                                            ) && 
                                            this.isVowel(fixed.charAt(chk))
                                        ) ^ match.negative
                                    ) {
                                        replace = false;
                                        break;
                                    }
                                }
                                // Consonant
                                else if(match.scope === "consonant") {
                                    if(
                                        ! (
                                            (
                                                (chk >= 0 && (match.type === "prefix")) || 
                                                (chk < fixed.length && match.type === ("suffix"))
                                            ) && 
                                            this.isConsonant(fixed.charAt(chk))
                                        ) ^ match.negative
                                    ) {
                                        replace = false;
                                        break;
                                    }
                                }
                                // Exact
                                else if(match.scope === "exact") {
                                    var s, e;
                                    if(match.type === "suffix") {
                                        s = end;
                                        e = end + match.value.length;
                                    } 
                                    // Prefix
                                    else {
                                        s = start - match.value.length;
                                        e = start;
                                    }
                                    if(!this.isExact(match.value, fixed, s, e, match.negative)) {
                                        replace = false;
                                        break;
                                    }
                                }
                            }

                            if(replace) {
                                output += rule.replace;
                                cur = end - 1;
                                matched = true;
                                break;
                            }

                        }
                    }
                    if(matched == true) break;

                    // Default
                    output += pattern.replace;
                    cur = end - 1;
                    matched = true;
                    break;
                }
            }

            if(!matched) {
                output += fixed.charAt(cur);
            }
        }
        return output;
    },
    fixString: function(input) {
        var fixed = '';
        for(var i=0; i < input.length; ++i) {
            var cChar = input.charAt(i);
            if(this.isCaseSensitive(cChar)) {
                fixed += cChar;
            } else {
                fixed += cChar.toLowerCase();
            }
        }
        return fixed;
    },
    isVowel: function(c) {
        return (this.data.vowel.indexOf(c.toLowerCase()) >= 0);
    },
    isConsonant: function(c) {
        return (this.data.consonant.indexOf(c.toLowerCase()) >= 0);
    },
    isPunctuation: function(c) {
        return (!(this.isVowel(c) || this.isConsonant(c)));
    },
    isExact: function(needle, heystack, start, end, not) {
        return ((start >= 0 && end < heystack.length && (heystack.substring(start, end)  === needle)) ^ not);
    },
    isCaseSensitive: function(c) {
        return (this.data.casesensitive.indexOf(c.toLowerCase()) >= 0);
    },
    data: {
        "patterns":
       [
  {
    "find": "$",
    "replace": "৳",
    "rules": []
  },
  {
    "find": ".",
    "replace": "।",
    "rules": [
      {
        "replace": ".",
        "matches": [
          {
            "type": "suffix",
            "scope": "digit"
          }
        ]
      }
    ]
  },
  {
    "find": "...",
    "replace": "...",
    "rules": []
  },
  {
    "find": "./",
    "replace": ".",
    "rules": []
  },
  {
    "find": "/",
    "replace": "",
    "rules": []
  },
  {
    "find": "//",
    "replace": "/",
    "rules": []
  },
  {
    "find": "0",
    "replace": "০",
    "rules": []
  },
  {
    "find": "1",
    "replace": "১",
    "rules": []
  },
  {
    "find": "2",
    "replace": "২",
    "rules": []
  },
  {
    "find": "3",
    "replace": "৩",
    "rules": []
  },
  {
    "find": "4",
    "replace": "৪",
    "rules": []
  },
  {
    "find": "5",
    "replace": "৫",
    "rules": []
  },
  {
    "find": "6",
    "replace": "৬",
    "rules": []
  },
  {
    "find": "7",
    "replace": "৭",
    "rules": []
  },
  {
    "find": "8",
    "replace": "৮",
    "rules": []
  },
  {
    "find": "9",
    "replace": "৯",
    "rules": []
  },
  {
    "find": "`",
    "replace": "‌",
    "rules": []
  },
  {
    "find": "``",
    "replace": "‍",
    "rules": []
  },
  {
    "find": "a",
    "replace": "া",
    "rules": [
      {
        "replace": "আ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "f"
          }
        ]
      },
      {
        "replace": "আ",
        "matches": [
          {
            "type": "prefix",
            "scope": "!consonant"
          }
        ]
      }
    ]
  },
  {
    "find": "ae",
    "replace": "্যা",
    "rules": [
      {
        "replace": "অ্যা",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "f"
          }
        ]
      },
      {
        "replace": "অ্যা",
        "matches": [
          {
            "type": "prefix",
            "scope": "!consonant"
          }
        ]
      }
    ]
  },
  {
    "find": "b",
    "replace": "ব্",
    "rules": [
      {
        "replace": "ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "bh",
    "replace": "ভ্",
    "rules": [
      {
        "replace": "ভ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "c",
    "replace": "চ্",
    "rules": [
      {
        "replace": "চ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "ch",
    "replace": "ছ্",
    "rules": [
      {
        "replace": "ছ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "d",
    "replace": "দ্",
    "rules": [
      {
        "replace": "দ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "df",
    "replace": "ড্",
    "rules": [
      {
        "replace": "ড",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "dff",
    "replace": "ঢ্",
    "rules": [
      {
        "replace": "ঢ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "dh",
    "replace": "ধ্",
    "rules": [
      {
        "replace": "ধ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "e",
    "replace": "ে",
    "rules": [
      {
        "replace": "এ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "f"
          }
        ]
      },
      {
        "replace": "এ",
        "matches": [
          {
            "type": "prefix",
            "scope": "!consonant"
          }
        ]
      }
    ]
  },
  {
    "find": "f",
    "replace": "",
    "rules": []
  },
  {
    "find": "g",
    "replace": "গ্",
    "rules": [
      {
        "replace": "গ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "gf",
    "replace": "জ্ঞ",
    "rules": []
  },
  {
    "find": "gh",
    "replace": "ঘ্",
    "rules": [
      {
        "replace": "ঘ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "h",
    "replace": "হ্",
    "rules": [
      {
        "replace": "হ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "hf",
    "replace": "ঃ",
    "rules": []
  },
  {
    "find": "i",
    "replace": "ি",
    "rules": [
      {
        "replace": "ই",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "f"
          }
        ]
      },
      {
        "replace": "ই",
        "matches": [
          {
            "type": "prefix",
            "scope": "!consonant"
          }
        ]
      }
    ]
  },
  {
    "find": "ii",
    "replace": "ী",
    "rules": [
      {
        "replace": "ঈ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "f"
          }
        ]
      },
      {
        "replace": "ঈ",
        "matches": [
          {
            "type": "prefix",
            "scope": "!consonant"
          }
        ]
      }
    ]
  },
  {
    "find": "j",
    "replace": "জ্",
    "rules": [
      {
        "replace": "জ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "jh",
    "replace": "ঝ্",
    "rules": [
      {
        "replace": "ঝ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "k",
    "replace": "ক্",
    "rules": [
      {
        "replace": "ক",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "kh",
    "replace": "খ্",
    "rules": [
      {
        "replace": "খ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "l",
    "replace": "ল্",
    "rules": [
      {
        "replace": "ল",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "m",
    "replace": "ম্",
    "rules": [
      {
        "replace": "ম",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "n",
    "replace": "ন্",
    "rules": [
      {
        "replace": "ন",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "nf",
    "replace": "ণ্",
    "rules": [
      {
        "replace": "ণ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "nff",
    "replace": "ঞ্",
    "rules": [
      {
        "replace": "ঞ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "ng",
    "replace": "ং",
    "rules": []
  },
  {
    "find": "ngf",
    "replace": "ঙ্",
    "rules": [
      {
        "replace": "ঙ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "o",
    "replace": "",
    "rules": []
  },
  {
    "find": "oi",
    "replace": "ৈ",
    "rules": [
      {
        "replace": "ই",
        "matches": [
          {
            "type": "prefix",
            "scope": "consonant"
          },
          {
            "type": "suffix",
            "scope": "exact",
            "value": "f"
          }
        ]
      },
      {
        "replace": "ঐ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "f"
          }
        ]
      },
      {
        "replace": "ঐ",
        "matches": [
          {
            "type": "prefix",
            "scope": "!consonant"
          }
        ]
      }
    ]
  },
  {
    "find": "oo",
    "replace": "ো",
    "rules": [
      {
        "replace": "ও",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "f"
          }
        ]
      },
      {
        "replace": "ও",
        "matches": [
          {
            "type": "prefix",
            "scope": "!consonant"
          }
        ]
      }
    ]
  },
  {
    "find": "ou",
    "replace": "ৌ",
    "rules": [
      {
        "replace": "উ",
        "matches": [
          {
            "type": "prefix",
            "scope": "consonant"
          },
          {
            "type": "suffix",
            "scope": "exact",
            "value": "f"
          }
        ]
      },
      {
        "replace": "ঔ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "f"
          }
        ]
      },
      {
        "replace": "ঔ",
        "matches": [
          {
            "type": "prefix",
            "scope": "!consonant"
          }
        ]
      }
    ]
  },
  {
    "find": "p",
    "replace": "প্",
    "rules": [
      {
        "replace": "প",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "ph",
    "replace": "ফ্",
    "rules": [
      {
        "replace": "ফ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "q",
    "replace": "ঁ",
    "rules": []
  },
  {
    "find": "qq",
    "replace": "্ (হসন্ত)",
    "rules": []
  },
  {
    "find": "r",
    "replace": "র্",
    "rules": [
      {
        "replace": "র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "rf",
    "replace": "ড়্",
    "rules": [
      {
        "replace": "ড়",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "rff",
    "replace": "ঢ়্",
    "rules": [
      {
        "replace": "ঢ়",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "ry",
    "replace": "র‌্য",
    "rules": []
  },
  {
    "find": "s",
    "replace": "স্",
    "rules": [
      {
        "replace": "স",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "sf",
    "replace": "ষ্",
    "rules": [
      {
        "replace": "ষ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "sh",
    "replace": "শ্",
    "rules": [
      {
        "replace": "শ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "t",
    "replace": "ত্",
    "rules": [
      {
        "replace": "ত",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "tf",
    "replace": "ট্",
    "rules": [
      {
        "replace": "ট",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "tff",
    "replace": "ঠ্",
    "rules": [
      {
        "replace": "ঠ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "th",
    "replace": "থ্",
    "rules": [
      {
        "replace": "থ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "u",
    "replace": "ু",
    "rules": [
      {
        "replace": "উ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "f"
          }
        ]
      },
      {
        "replace": "উ",
        "matches": [
          {
            "type": "prefix",
            "scope": "!consonant"
          }
        ]
      }
    ]
  },
  {
    "find": "uu",
    "replace": "ূ",
    "rules": [
      {
        "replace": "ঊ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "f"
          }
        ]
      },
      {
        "replace": "ঊ",
        "matches": [
          {
            "type": "prefix",
            "scope": "!consonant"
          }
        ]
      }
    ]
  },
  {
    "find": "w",
    "replace": "ৃ",
    "rules": [
      {
        "replace": "ঋ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "f"
          }
        ]
      },
      {
        "replace": "ঋ",
        "matches": [
          {
            "type": "prefix",
            "scope": "!consonant"
          }
        ]
      }
    ]
  },
  {
    "find": "y",
    "replace": "য়্",
    "rules": [
      {
        "replace": "য়",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "z",
    "replace": "য্",
    "rules": [
      {
        "replace": "য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!consonant"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "/"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "`"
          }
        ]
      }
    ]
  }
],
        "vowel":"aeiou",
        "consonant":"bcdfghjklmnpqrstvwxyz",
        "casesensitive":"oiudgjnrstyz"
    }
};
