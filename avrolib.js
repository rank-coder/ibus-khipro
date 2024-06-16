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
        return ((start >= 0 && end <= heystack.length && (heystack.substring(start, end)  === needle)) ^ not);
    },
    isCaseSensitive: function(c) {
        return (this.data.casesensitive.indexOf(c.toLowerCase()) >= 0);
    },
    data: {
        "patterns": [
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
      },
      {
        "replace": "য",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "য়",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "ঋ",
        "matches": [
          {
            "type": "prefix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "ঊ",
        "matches": [
          {
            "type": "prefix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "উ",
        "matches": [
          {
            "type": "prefix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "থ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
          }
        ]
      }
    ]
  },
  {
    "find": "tfff",
    "replace": "ট্ট"
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
      },
      {
        "replace": "ঠ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "ট",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "ত",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "শ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "ষ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
          }
        ]
      }
    ]
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
      },
      {
        "replace": "স",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
          }
        ]
      }
    ]
  },
  {
    "find": "ry",
    "replace": "র‌্য"
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
      },
      {
        "replace": "ঢ়",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "ড়",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
          }
        ]
      }
    ]
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
      },
      {
        "replace": "র",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
          }
        ]
      }
    ]
  },
  {
    "find": "qq",
    "replace": "্ (হসন্ত)"
  },
  {
    "find": "q",
    "replace": "ঁ"
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
      },
      {
        "replace": "ফ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "প",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "ঔ",
        "matches": [
          {
            "type": "prefix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "ও",
        "matches": [
          {
            "type": "prefix",
            "scope": "exact",
            "value": "w"
          }
        ]
      }
    ]
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
      },
      {
        "replace": "ঐ",
        "matches": [
          {
            "type": "prefix",
            "scope": "exact",
            "value": "w"
          }
        ]
      }
    ]
  },
  {
    "find": "o",
    "replace": "",
    "rules": [
      {
        "replace": "অ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "f"
          }
        ]
      },
      {
        "replace": "অ",
        "matches": [
          {
            "type": "prefix",
            "scope": "!consonant"
          }
        ]
      },
      {
        "replace": "অ",
        "matches": [
          {
            "type": "prefix",
            "scope": "exact",
            "value": "w"
          }
        ]
      }
    ]
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
      },
      {
        "replace": "ঙ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
          }
        ]
      }
    ]
  },
  {
    "find": "ng",
    "replace": "ং",
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
      },
      {
        "replace": "ঙ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "ঞ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "ণ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "ন",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "ম",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "ল",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "খ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "ক",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "ঝ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "জ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "ঈ",
        "matches": [
          {
            "type": "prefix",
            "scope": "exact",
            "value": "w"
          }
        ]
      }
    ]
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
      },
      {
        "replace": "ই",
        "matches": [
          {
            "type": "prefix",
            "scope": "exact",
            "value": "w"
          }
        ]
      }
    ]
  },
  {
    "find": "hf",
    "replace": "ঃ"
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
      },
      {
        "replace": "হ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
          }
        ]
      }
    ]
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
      },
      {
        "replace": "ঘ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
          }
        ]
      }
    ]
  },
  {
    "find": "gf",
    "replace": "জ্ঞ"
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
      },
      {
        "replace": "গ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
          }
        ]
      }
    ]
  },
  {
    "find": "f",
    "replace": ""
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
      },
      {
        "replace": "এ",
        "matches": [
          {
            "type": "prefix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "ধ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
          }
        ]
      }
    ]
  },
  {
    "find": "dfff",
    "replace": "ড্ড"
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
      },
      {
        "replace": "ঢ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "ড",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "দ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "ছ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "চ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "ভ",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "exact",
            "value": "w"
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
      },
      {
        "replace": "অ্যা",
        "matches": [
          {
            "type": "prefix",
            "scope": "exact",
            "value": "w"
          }
        ]
      }
    ]
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
      },
      {
        "replace": "আ",
        "matches": [
          {
            "type": "prefix",
            "scope": "exact",
            "value": "w"
          }
        ]
      }
    ]
  },
  {
    "find": "``",
    "replace": "‍"
  },
  {
    "find": "`",
    "replace": "‌"
  },
  {
    "find": "9",
    "replace": "৯"
  },
  {
    "find": "8",
    "replace": "৮"
  },
  {
    "find": "7",
    "replace": "৭"
  },
  {
    "find": "6",
    "replace": "৬"
  },
  {
    "find": "5",
    "replace": "৫"
  },
  {
    "find": "4",
    "replace": "৪"
  },
  {
    "find": "3",
    "replace": "৩"
  },
  {
    "find": "2",
    "replace": "২"
  },
  {
    "find": "1",
    "replace": "১"
  },
  {
    "find": "0",
    "replace": "০"
  },
  {
    "find": "//",
    "replace": "/"
  },
  {
    "find": "/",
    "replace": ""
  },
  {
    "find": "./",
    "replace": "."
  },
  {
    "find": "...",
    "replace": "..."
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
    "find": "$",
    "replace": "৳"
  }
],
        "vowel":"aeiou",
        "consonant":"bcdfghjklmnpqrstvwxyz",
        "digit":"1234567890",
        "casesensitive":"oiudgjnrstyz"
    }
};
