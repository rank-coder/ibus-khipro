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
                                // Digit
                                else if(match.scope === "digit") {
                                    if(
                                        ! (
                                            (
                                                (chk >= 0 && (match.type === "prefix")) || 
                                                (chk < fixed.length && match.type === ("suffix"))
                                            ) && 
                                            this.isDigit(fixed.charAt(chk))
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
    isDigit: function(c) {
        return (this.data.digit.indexOf(c) >= 0);
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
    "find": "zz",
    "replace": "য্য্",
    "rules": [
      {
        "replace": "য্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "y",
    "replace": "য়্",
    "rules": [
      {
        "replace": "য়",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "xx",
    "replace": "্"
  },
  {
    "find": "x",
    "replace": "ঃ"
  },
  {
    "find": "wff",
    "replace": "‌ৃ"
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
    "find": "vz",
    "replace": "ভ্য্",
    "rules": [
      {
        "replace": "ভ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "vr",
    "replace": "ভ্র্",
    "rules": [
      {
        "replace": "ভ্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "vl",
    "replace": "ভ্ল্",
    "rules": [
      {
        "replace": "ভ্ল",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "vb",
    "replace": "ভ্ব্",
    "rules": [
      {
        "replace": "ভ্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "v",
    "replace": "ভ্",
    "rules": [
      {
        "replace": "ভ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "uuff",
    "replace": "‌ূ"
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
    "find": "uff",
    "replace": "‌ু"
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
    "find": "tz",
    "replace": "ত্য্",
    "rules": [
      {
        "replace": "ত্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "txx",
    "replace": "ৎ"
  },
  {
    "find": "ttz",
    "replace": "ত্ত্য্",
    "rules": [
      {
        "replace": "ত্ত্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "tth",
    "replace": "ত্থ্",
    "rules": [
      {
        "replace": "ত্থ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ttff",
    "replace": "তঠ্",
    "rules": [
      {
        "replace": "তঠ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ttf",
    "replace": "ট্ট্",
    "rules": [
      {
        "replace": "ট্ট",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ttb",
    "replace": "ত্ত্ব্",
    "rules": [
      {
        "replace": "ত্ত্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "tt",
    "replace": "ত্ত্",
    "rules": [
      {
        "replace": "ত্ত",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "trz",
    "replace": "ত্র্য্",
    "rules": [
      {
        "replace": "ত্র্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "tr",
    "replace": "ত্র্",
    "rules": [
      {
        "replace": "ত্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "tn",
    "replace": "ত্ন্",
    "rules": [
      {
        "replace": "ত্ন",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "tmz",
    "replace": "ত্ম্য্",
    "rules": [
      {
        "replace": "ত্ম্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "tm",
    "replace": "ত্ম্",
    "rules": [
      {
        "replace": "ত্ম",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "thz",
    "replace": "থ্য্",
    "rules": [
      {
        "replace": "থ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "thr",
    "replace": "থ্র্",
    "rules": [
      {
        "replace": "থ্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "thb",
    "replace": "থ্ব্",
    "rules": [
      {
        "replace": "থ্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "tfz",
    "replace": "ট্য্",
    "rules": [
      {
        "replace": "ট্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "tftff",
    "replace": "টঠ্",
    "rules": [
      {
        "replace": "টঠ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "tftf",
    "replace": "ট্ট্",
    "rules": [
      {
        "replace": "ট্ট",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "tfr",
    "replace": "ট্র্",
    "rules": [
      {
        "replace": "ট্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "tfm",
    "replace": "ট্ম্",
    "rules": [
      {
        "replace": "ট্ম",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "tfb",
    "replace": "ট্ব্",
    "rules": [
      {
        "replace": "ট্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "tb",
    "replace": "ত্ব্",
    "rules": [
      {
        "replace": "ত্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sz",
    "replace": "স্য্",
    "rules": [
      {
        "replace": "স্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "stz",
    "replace": "স্ত্য্",
    "rules": [
      {
        "replace": "স্ত্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "str",
    "replace": "স্ত্র্",
    "rules": [
      {
        "replace": "স্ত্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sthz",
    "replace": "স্থ্য্",
    "rules": [
      {
        "replace": "স্থ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sth",
    "replace": "স্থ্",
    "rules": [
      {
        "replace": "স্থ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "stfr",
    "replace": "স্ট্র্",
    "rules": [
      {
        "replace": "স্ট্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "stff",
    "replace": "সঠ্",
    "rules": [
      {
        "replace": "সঠ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "stf",
    "replace": "স্ট্",
    "rules": [
      {
        "replace": "স্ট",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "stb",
    "replace": "স্ত্ব্",
    "rules": [
      {
        "replace": "স্ত্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "st",
    "replace": "স্ত্",
    "rules": [
      {
        "replace": "স্ত",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sr",
    "replace": "স্র্",
    "rules": [
      {
        "replace": "স্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "spr",
    "replace": "স্প্র্",
    "rules": [
      {
        "replace": "স্প্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "spl",
    "replace": "স্প্ল্",
    "rules": [
      {
        "replace": "স্প্ল",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sph",
    "replace": "স্ফ্",
    "rules": [
      {
        "replace": "স্ফ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sp",
    "replace": "স্প্",
    "rules": [
      {
        "replace": "স্প",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sn",
    "replace": "স্ন্",
    "rules": [
      {
        "replace": "স্ন",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sm",
    "replace": "স্ম্",
    "rules": [
      {
        "replace": "স্ম",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sl",
    "replace": "স্ল্",
    "rules": [
      {
        "replace": "স্ল",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "skr",
    "replace": "স্ক্র্",
    "rules": [
      {
        "replace": "স্ক্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "skh",
    "replace": "স্খ্",
    "rules": [
      {
        "replace": "স্খ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sk",
    "replace": "স্ক্",
    "rules": [
      {
        "replace": "স্ক",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "shz",
    "replace": "শ্য্",
    "rules": [
      {
        "replace": "শ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "shr",
    "replace": "শ্র্",
    "rules": [
      {
        "replace": "শ্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "shn",
    "replace": "শ্ন্",
    "rules": [
      {
        "replace": "শ্ন",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "shm",
    "replace": "শ্ম্",
    "rules": [
      {
        "replace": "শ্ম",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "shl",
    "replace": "শ্ল্",
    "rules": [
      {
        "replace": "শ্ল",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "shch",
    "replace": "শ্ছ্",
    "rules": [
      {
        "replace": "শ্ছ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "shc",
    "replace": "শ্চ্",
    "rules": [
      {
        "replace": "শ্চ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "shb",
    "replace": "শ্ব্",
    "rules": [
      {
        "replace": "শ্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sfz",
    "replace": "ষ্য্",
    "rules": [
      {
        "replace": "ষ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sftfz",
    "replace": "ষ্ট্য্",
    "rules": [
      {
        "replace": "ষ্ট্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sftfr",
    "replace": "ষ্ট্র্",
    "rules": [
      {
        "replace": "ষ্ট্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sftffz",
    "replace": "ষ্ঠ্য্",
    "rules": [
      {
        "replace": "ষ্ঠ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sftff",
    "replace": "ষ্ঠ্",
    "rules": [
      {
        "replace": "ষ্ঠ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sftf",
    "replace": "ষ্ট্",
    "rules": [
      {
        "replace": "ষ্ট",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sfpr",
    "replace": "ষ্প্র্",
    "rules": [
      {
        "replace": "ষ্প্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sfph",
    "replace": "ষ্ফ্",
    "rules": [
      {
        "replace": "ষ্ফ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sfp",
    "replace": "ষ্প্",
    "rules": [
      {
        "replace": "ষ্প",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sfnf",
    "replace": "ষ্ণ্",
    "rules": [
      {
        "replace": "ষ্ণ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sfn",
    "replace": "ষ্ণ্",
    "rules": [
      {
        "replace": "ষ্ণ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sfm",
    "replace": "ষ্ম্",
    "rules": [
      {
        "replace": "ষ্ম",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sfkr",
    "replace": "ষ্ক্র্",
    "rules": [
      {
        "replace": "ষ্ক্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sfk",
    "replace": "ষ্ক্",
    "rules": [
      {
        "replace": "ষ্ক",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sfb",
    "replace": "ষ্ব্",
    "rules": [
      {
        "replace": "ষ্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "sb",
    "replace": "স্ব্",
    "rules": [
      {
        "replace": "স্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "s",
    "replace": "স্",
    "rules": [
      {
        "replace": "স",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "replace": "র‌্য"
  },
  {
    "find": "rfg",
    "replace": "ড়্‌গ্",
    "rules": [
      {
        "replace": "ড়্‌গ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "z"
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
            "value": "`"
          }
        ]
      }
    ]
  },
  {
    "find": "qq",
    "replace": "ঁ"
  },
  {
    "find": "q",
    "replace": "ং"
  },
  {
    "find": "pz",
    "replace": "প্য্",
    "rules": [
      {
        "replace": "প্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ptff",
    "replace": "পঠ্",
    "rules": [
      {
        "replace": "পঠ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ptf",
    "replace": "প্ট্",
    "rules": [
      {
        "replace": "প্ট",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "pt",
    "replace": "প্ত্",
    "rules": [
      {
        "replace": "প্ত",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ps",
    "replace": "প্স্",
    "rules": [
      {
        "replace": "প্স",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "pr",
    "replace": "প্র্",
    "rules": [
      {
        "replace": "প্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "pp",
    "replace": "প্প্",
    "rules": [
      {
        "replace": "প্প",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "pn",
    "replace": "প্ন্",
    "rules": [
      {
        "replace": "প্ন",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "pl",
    "replace": "প্ল্",
    "rules": [
      {
        "replace": "প্ল",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "phr",
    "replace": "ফ্র্",
    "rules": [
      {
        "replace": "ফ্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "phl",
    "replace": "ফ্ল্",
    "rules": [
      {
        "replace": "ফ্ল",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "p",
    "replace": "প্",
    "rules": [
      {
        "replace": "প",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
      }
    ]
  },
  {
    "find": "nz",
    "replace": "ন্য্",
    "rules": [
      {
        "replace": "ন্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ntrz",
    "replace": "ন্ত্র্য্",
    "rules": [
      {
        "replace": "ন্ত্র্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ntr",
    "replace": "ন্ত্র্",
    "rules": [
      {
        "replace": "ন্ত্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nthr",
    "replace": "ন্থ্র্",
    "rules": [
      {
        "replace": "ন্থ্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nth",
    "replace": "ন্থ্",
    "rules": [
      {
        "replace": "ন্থ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ntfr",
    "replace": "ন্ট্র্",
    "rules": [
      {
        "replace": "ন্ট্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ntff",
    "replace": "ন্ঠ্",
    "rules": [
      {
        "replace": "ন্ঠ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ntf",
    "replace": "ন্ট্",
    "rules": [
      {
        "replace": "ন্ট",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ntb",
    "replace": "ন্ত্ব্",
    "rules": [
      {
        "replace": "ন্ত্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nt",
    "replace": "ন্ত্",
    "rules": [
      {
        "replace": "ন্ত",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ns",
    "replace": "ন্স্",
    "rules": [
      {
        "replace": "ন্স",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nn",
    "replace": "ন্ন্",
    "rules": [
      {
        "replace": "ন্ন",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nm",
    "replace": "ন্ম্",
    "rules": [
      {
        "replace": "ন্ম",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "njh",
    "replace": "ঞ্ঝ্",
    "rules": [
      {
        "replace": "ঞ্ঝ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nj",
    "replace": "ঞ্জ্",
    "rules": [
      {
        "replace": "ঞ্জ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ngm",
    "replace": "ঙ্ম্",
    "rules": [
      {
        "replace": "ঙ্ম",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ngkz",
    "replace": "ঙ্ক্য্",
    "rules": [
      {
        "replace": "ঙ্ক্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ngkt",
    "replace": "ঙ্‌ক্তি্",
    "rules": [
      {
        "replace": "ঙ্‌ক্তি",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ngksf",
    "replace": "ঙ্ক্ষ্",
    "rules": [
      {
        "replace": "ঙ্ক্ষ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ngkr",
    "replace": "ঙ্ক্র্",
    "rules": [
      {
        "replace": "ঙ্ক্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ngkkh",
    "replace": "ঙ্ক্ষ্",
    "rules": [
      {
        "replace": "ঙ্ক্ষ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ngkh",
    "replace": "ঙ্খ্",
    "rules": [
      {
        "replace": "ঙ্খ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ngk",
    "replace": "ঙ্ক্",
    "rules": [
      {
        "replace": "ঙ্ক",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nggz",
    "replace": "ঙ্গ্য্",
    "rules": [
      {
        "replace": "ঙ্গ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ngghz",
    "replace": "ঙ্ঘ্য্",
    "rules": [
      {
        "replace": "ঙ্ঘ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ngghr",
    "replace": "ঙ্ঘ্র্",
    "rules": [
      {
        "replace": "ঙ্ঘ্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nggh",
    "replace": "ঙ্ঘ্",
    "rules": [
      {
        "replace": "ঙ্ঘ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ngg",
    "replace": "ঙ্গ্",
    "rules": [
      {
        "replace": "ঙ্গ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "replace": "ঙ্",
    "rules": [
      {
        "replace": "ঙ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nfz",
    "replace": "ণ্য্",
    "rules": [
      {
        "replace": "ণ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nftffz",
    "replace": "ণ্ঠ্য্",
    "rules": [
      {
        "replace": "ণ্ঠ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nftff",
    "replace": "ণ্ঠ্",
    "rules": [
      {
        "replace": "ণ্ঠ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nftf",
    "replace": "ণ্ট্",
    "rules": [
      {
        "replace": "ণ্ট",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nfnf",
    "replace": "ণ্ণ্",
    "rules": [
      {
        "replace": "ণ্ণ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nfn",
    "replace": "ণ্ণ্",
    "rules": [
      {
        "replace": "ণ্ণ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nfm",
    "replace": "ণ্ম্",
    "rules": [
      {
        "replace": "ণ্ম",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nffjh",
    "replace": "ঞ্ঝ্",
    "rules": [
      {
        "replace": "ঞ্ঝ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nffj",
    "replace": "ঞ্জ্",
    "rules": [
      {
        "replace": "ঞ্জ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nffch",
    "replace": "ঞ্ছ্",
    "rules": [
      {
        "replace": "ঞ্ছ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nffc",
    "replace": "ঞ্চ্",
    "rules": [
      {
        "replace": "ঞ্চ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nfdfz",
    "replace": "ণ্ড্য্",
    "rules": [
      {
        "replace": "ণ্ড্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nfdfr",
    "replace": "ণ্ড্র্",
    "rules": [
      {
        "replace": "ণ্ড্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nfdff",
    "replace": "ণ্ঢ্",
    "rules": [
      {
        "replace": "ণ্ঢ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nfdf",
    "replace": "ণ্ড্",
    "rules": [
      {
        "replace": "ণ্ড",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nfb",
    "replace": "ণ্ব্",
    "rules": [
      {
        "replace": "ণ্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ndz",
    "replace": "ন্দ্য্",
    "rules": [
      {
        "replace": "ন্দ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ndr",
    "replace": "ন্দ্র্",
    "rules": [
      {
        "replace": "ন্দ্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ndhz",
    "replace": "ন্ধ্য্",
    "rules": [
      {
        "replace": "ন্ধ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ndhr",
    "replace": "ন্ধ্র্",
    "rules": [
      {
        "replace": "ন্ধ্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ndh",
    "replace": "ন্ধ্",
    "rules": [
      {
        "replace": "ন্ধ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ndfr",
    "replace": "ন্ড্র্",
    "rules": [
      {
        "replace": "ন্ড্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ndff",
    "replace": "নঢ্",
    "rules": [
      {
        "replace": "নঢ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ndf",
    "replace": "ন্ড্",
    "rules": [
      {
        "replace": "ন্ড",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ndb",
    "replace": "ন্দ্ব্",
    "rules": [
      {
        "replace": "ন্দ্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nd",
    "replace": "ন্দ্",
    "rules": [
      {
        "replace": "ন্দ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nch",
    "replace": "ঞ্ছ্",
    "rules": [
      {
        "replace": "ঞ্ছ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nc",
    "replace": "ঞ্চ্",
    "rules": [
      {
        "replace": "ঞ্চ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "nb",
    "replace": "ন্ব্",
    "rules": [
      {
        "replace": "ন্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "mz",
    "replace": "ম্য্",
    "rules": [
      {
        "replace": "ম্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "mvr",
    "replace": "ম্ভ্র্",
    "rules": [
      {
        "replace": "ম্ভ্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "mv",
    "replace": "ম্ভ্",
    "rules": [
      {
        "replace": "ম্ভ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "mr",
    "replace": "ম্র্",
    "rules": [
      {
        "replace": "ম্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "mpr",
    "replace": "ম্প্র্",
    "rules": [
      {
        "replace": "ম্প্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "mph",
    "replace": "ম্ফ্",
    "rules": [
      {
        "replace": "ম্ফ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "mp",
    "replace": "ম্প্",
    "rules": [
      {
        "replace": "ম্প",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "mn",
    "replace": "ম্ন্",
    "rules": [
      {
        "replace": "ম্ন",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "mm",
    "replace": "ম্ম্",
    "rules": [
      {
        "replace": "ম্ম",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ml",
    "replace": "ম্ল্",
    "rules": [
      {
        "replace": "ম্ল",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "mbr",
    "replace": "ম্ব্র্",
    "rules": [
      {
        "replace": "ম্ব্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "mbhr",
    "replace": "ম্ভ্র্",
    "rules": [
      {
        "replace": "ম্ভ্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "mbh",
    "replace": "ম্ভ্",
    "rules": [
      {
        "replace": "ম্ভ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "mb",
    "replace": "ম্ব্",
    "rules": [
      {
        "replace": "ম্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "lz",
    "replace": "ল্য্",
    "rules": [
      {
        "replace": "ল্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "lv",
    "replace": "ল্‌ভ্",
    "rules": [
      {
        "replace": "ল্‌ভ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ltff",
    "replace": "লঠ্",
    "rules": [
      {
        "replace": "লঠ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ltf",
    "replace": "ল্ট্",
    "rules": [
      {
        "replace": "ল্ট",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "lph",
    "replace": "ল্ফ্",
    "rules": [
      {
        "replace": "ল্ফ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "lp",
    "replace": "ল্প্",
    "rules": [
      {
        "replace": "ল্প",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "lm",
    "replace": "ল্ম্",
    "rules": [
      {
        "replace": "ল্ম",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ll",
    "replace": "ল্ল্",
    "rules": [
      {
        "replace": "ল্ল",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "lkz",
    "replace": "ল্ক্য্",
    "rules": [
      {
        "replace": "ল্ক্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "lk",
    "replace": "ল্ক্",
    "rules": [
      {
        "replace": "ল্ক",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "lg",
    "replace": "ল্গ্",
    "rules": [
      {
        "replace": "ল্গ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ldff",
    "replace": "লঢ্",
    "rules": [
      {
        "replace": "লঢ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ldf",
    "replace": "ল্ড্",
    "rules": [
      {
        "replace": "ল্ড",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "lbh",
    "replace": "ল্‌ভ্",
    "rules": [
      {
        "replace": "ল্‌ভ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "lb",
    "replace": "ল্ব্",
    "rules": [
      {
        "replace": "ল্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "kz",
    "replace": "ক্য্",
    "rules": [
      {
        "replace": "ক্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ktr",
    "replace": "ক্ত্র্",
    "rules": [
      {
        "replace": "ক্ত্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ktfr",
    "replace": "ক্ট্র্",
    "rules": [
      {
        "replace": "ক্ট্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ktff",
    "replace": "কঠ্",
    "rules": [
      {
        "replace": "কঠ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ktf",
    "replace": "ক্ট্",
    "rules": [
      {
        "replace": "ক্ট",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "kt",
    "replace": "ক্ত্",
    "rules": [
      {
        "replace": "ক্ত",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ksfz",
    "replace": "ক্ষ্য্",
    "rules": [
      {
        "replace": "ক্ষ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ksfnf",
    "replace": "ক্ষ্ণ্",
    "rules": [
      {
        "replace": "ক্ষ্ণ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ksfn",
    "replace": "ক্ষ্ণ্",
    "rules": [
      {
        "replace": "ক্ষ্ণ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ksfm",
    "replace": "ক্ষ্ম্",
    "rules": [
      {
        "replace": "ক্ষ্ম",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ksfb",
    "replace": "ক্ষ্ব্",
    "rules": [
      {
        "replace": "ক্ষ্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ksf",
    "replace": "ক্ষ্",
    "rules": [
      {
        "replace": "ক্ষ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ks",
    "replace": "ক্স্",
    "rules": [
      {
        "replace": "ক্স",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "kr",
    "replace": "ক্র্",
    "rules": [
      {
        "replace": "ক্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "km",
    "replace": "ক্ম্",
    "rules": [
      {
        "replace": "ক্ম",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "kl",
    "replace": "ক্ল্",
    "rules": [
      {
        "replace": "ক্ল",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "kkhz",
    "replace": "ক্ষ্য্",
    "rules": [
      {
        "replace": "ক্ষ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "kkhnf",
    "replace": "ক্ষ্ণ্",
    "rules": [
      {
        "replace": "ক্ষ্ণ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "kkhn",
    "replace": "ক্ষ্ণ্",
    "rules": [
      {
        "replace": "ক্ষ্ণ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "kkhm",
    "replace": "ক্ষ্ম্",
    "rules": [
      {
        "replace": "ক্ষ্ম",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "kkhb",
    "replace": "ক্ষ্ব্",
    "rules": [
      {
        "replace": "ক্ষ্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "kkh",
    "replace": "ক্ষ্",
    "rules": [
      {
        "replace": "ক্ষ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "kk",
    "replace": "ক্ক্",
    "rules": [
      {
        "replace": "ক্ক",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "khz",
    "replace": "খ্য্",
    "rules": [
      {
        "replace": "খ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "khr",
    "replace": "খ্র্",
    "rules": [
      {
        "replace": "খ্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "kb",
    "replace": "ক্ব্",
    "rules": [
      {
        "replace": "ক্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "jz",
    "replace": "জ্য্",
    "rules": [
      {
        "replace": "জ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "jr",
    "replace": "জ্র্",
    "rules": [
      {
        "replace": "জ্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "jnff",
    "replace": "জ্ঞ্",
    "rules": [
      {
        "replace": "জ্ঞ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "jjh",
    "replace": "জ্ঝ্",
    "rules": [
      {
        "replace": "জ্ঝ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "jjb",
    "replace": "জ্জ্ব্",
    "rules": [
      {
        "replace": "জ্জ্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "jj",
    "replace": "জ্জ্",
    "rules": [
      {
        "replace": "জ্জ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "jb",
    "replace": "জ্ব্",
    "rules": [
      {
        "replace": "জ্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "j",
    "replace": "জ্",
    "rules": [
      {
        "replace": "জ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "hz",
    "replace": "হ্য্",
    "rules": [
      {
        "replace": "হ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "hr",
    "replace": "হ্র্",
    "rules": [
      {
        "replace": "হ্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "hnf",
    "replace": "হ্ণ্",
    "rules": [
      {
        "replace": "হ্ণ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "hn",
    "replace": "হ্ন্",
    "rules": [
      {
        "replace": "হ্ন",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "hm",
    "replace": "হ্ম্",
    "rules": [
      {
        "replace": "হ্ম",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "hl",
    "replace": "হ্ল্",
    "rules": [
      {
        "replace": "হ্ল",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "hb",
    "replace": "হ্ব্",
    "rules": [
      {
        "replace": "হ্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "gz",
    "replace": "গ্য্",
    "rules": [
      {
        "replace": "গ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "grz",
    "replace": "গ্র্য্",
    "rules": [
      {
        "replace": "গ্র্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "gr",
    "replace": "গ্র্",
    "rules": [
      {
        "replace": "গ্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "gnz",
    "replace": "গ্ন্য্",
    "rules": [
      {
        "replace": "গ্ন্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "gnf",
    "replace": "গ্‌ণ্",
    "rules": [
      {
        "replace": "গ্‌ণ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "gn",
    "replace": "গ্ন্",
    "rules": [
      {
        "replace": "গ্ন",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "gm",
    "replace": "গ্ম্",
    "rules": [
      {
        "replace": "গ্ম",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "gl",
    "replace": "গ্ল্",
    "rules": [
      {
        "replace": "গ্ল",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ghr",
    "replace": "ঘ্র্",
    "rules": [
      {
        "replace": "ঘ্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ghn",
    "replace": "ঘ্ন্",
    "rules": [
      {
        "replace": "ঘ্ন",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "gh",
    "replace": "ঘ্",
    "rules": [
      {
        "replace": "ঘ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ggg",
    "replace": "গ্গ্",
    "rules": [
      {
        "replace": "গ্গ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "gg",
    "replace": "জ্ঞ্",
    "rules": [
      {
        "replace": "জ্ঞ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "gdhz",
    "replace": "গ্ধ্য্",
    "rules": [
      {
        "replace": "গ্ধ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "gdhr",
    "replace": "গ্ধ্র্",
    "rules": [
      {
        "replace": "গ্ধ্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "gdh",
    "replace": "গ্ধ্",
    "rules": [
      {
        "replace": "গ্ধ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "gb",
    "replace": "গ্ব্",
    "rules": [
      {
        "replace": "গ্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "g`b",
    "replace": "গ্‌ব্",
    "rules": [
      {
        "replace": "গ্‌ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "g",
    "replace": "গ্",
    "rules": [
      {
        "replace": "গ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
      }
    ]
  },
  {
    "find": "dz",
    "replace": "দ্য্",
    "rules": [
      {
        "replace": "দ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "dvr",
    "replace": "দ্ভ্র্",
    "rules": [
      {
        "replace": "দ্ভ্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "dv",
    "replace": "দ্ভ্",
    "rules": [
      {
        "replace": "দ্ভ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "drz",
    "replace": "দ্র্য্",
    "rules": [
      {
        "replace": "দ্র্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "dr",
    "replace": "দ্র্",
    "rules": [
      {
        "replace": "দ্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "dm",
    "replace": "দ্ম্",
    "rules": [
      {
        "replace": "দ্ম",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "dhz",
    "replace": "ধ্য্",
    "rules": [
      {
        "replace": "ধ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "dhr",
    "replace": "ধ্র্",
    "rules": [
      {
        "replace": "ধ্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "dhn",
    "replace": "ধ্ন্",
    "rules": [
      {
        "replace": "ধ্ন",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "dhm",
    "replace": "ধ্ম্",
    "rules": [
      {
        "replace": "ধ্ম",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "dhb",
    "replace": "ধ্ব্",
    "rules": [
      {
        "replace": "ধ্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "dgh",
    "replace": "দ্‌ঘ্",
    "rules": [
      {
        "replace": "দ্‌ঘ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "dg",
    "replace": "দ্‌গ্",
    "rules": [
      {
        "replace": "দ্‌গ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "dfz",
    "replace": "ড্য্",
    "rules": [
      {
        "replace": "ড্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "dfr",
    "replace": "ড্র্",
    "rules": [
      {
        "replace": "ড্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "dffz",
    "replace": "ঢ্য্",
    "rules": [
      {
        "replace": "ঢ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "dffr",
    "replace": "ঢ্র্",
    "rules": [
      {
        "replace": "ঢ্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "dfdff",
    "replace": "ডঢ্",
    "rules": [
      {
        "replace": "ডঢ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "dfdf",
    "replace": "ড্ড্",
    "rules": [
      {
        "replace": "ড্ড",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "dfb",
    "replace": "ড্ব্",
    "rules": [
      {
        "replace": "ড্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ddh",
    "replace": "দ্ধ্",
    "rules": [
      {
        "replace": "দ্ধ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ddff",
    "replace": "দঢ্",
    "rules": [
      {
        "replace": "দঢ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ddf",
    "replace": "ড্ড্",
    "rules": [
      {
        "replace": "ড্ড",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "ddb",
    "replace": "দ্দ্ব্",
    "rules": [
      {
        "replace": "দ্দ্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "dd",
    "replace": "দ্দ্",
    "rules": [
      {
        "replace": "দ্দ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "dbhr",
    "replace": "দ্ভ্র্",
    "rules": [
      {
        "replace": "দ্ভ্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "dbh",
    "replace": "দ্ভ্",
    "rules": [
      {
        "replace": "দ্ভ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "db",
    "replace": "দ্ব্",
    "rules": [
      {
        "replace": "দ্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "d`b",
    "replace": "দ্‌ব্",
    "rules": [
      {
        "replace": "দ্‌ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "cz",
    "replace": "চ্য্",
    "rules": [
      {
        "replace": "চ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "cnff",
    "replace": "চ্ঞ্",
    "rules": [
      {
        "replace": "চ্ঞ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "cchr",
    "replace": "চ্ছ্র্",
    "rules": [
      {
        "replace": "চ্ছ্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "cchb",
    "replace": "চ্ছ্ব্",
    "rules": [
      {
        "replace": "চ্ছ্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "cch",
    "replace": "চ্ছ্",
    "rules": [
      {
        "replace": "চ্ছ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "cc",
    "replace": "চ্চ্",
    "rules": [
      {
        "replace": "চ্চ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "cb",
    "replace": "চ্ব্",
    "rules": [
      {
        "replace": "চ্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "bz",
    "replace": "ব্য্",
    "rules": [
      {
        "replace": "ব্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "br",
    "replace": "ব্র্",
    "rules": [
      {
        "replace": "ব্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "bl",
    "replace": "ব্ল্",
    "rules": [
      {
        "replace": "ব্ল",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "bj",
    "replace": "ব্জ্",
    "rules": [
      {
        "replace": "ব্জ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "bhz",
    "replace": "ভ্য্",
    "rules": [
      {
        "replace": "ভ্য",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "bhr",
    "replace": "ভ্র্",
    "rules": [
      {
        "replace": "ভ্র",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "bhl",
    "replace": "ভ্ল্",
    "rules": [
      {
        "replace": "ভ্ল",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "bhb",
    "replace": "ভ্ব্",
    "rules": [
      {
        "replace": "ভ্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "bdh",
    "replace": "ব্ধ্",
    "rules": [
      {
        "replace": "ব্ধ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "bdff",
    "replace": "বঢ্",
    "rules": [
      {
        "replace": "বঢ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "bd",
    "replace": "ব্দ্",
    "rules": [
      {
        "replace": "ব্দ",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "bb",
    "replace": "ব্ব্",
    "rules": [
      {
        "replace": "ব্ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "b",
    "replace": "ব্",
    "rules": [
      {
        "replace": "ব",
        "matches": [
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "r"
          },
          {
            "type": "suffix",
            "scope": "!exact",
            "value": "z"
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
    "find": "``",
    "replace": "‍"
  },
  {
    "find": "`",
    "replace": "‌"
  },
  {
    "find": ";;",
    "replace": ";"
  },
  {
    "find": ";",
    "replace": ""
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
    "find": "...",
    "replace": "..."
  },
  {
    "find": "..",
    "replace": "."
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
        "vowel":"aeiouqwx",
        "consonant":"bcdfghjklmnprstvyz",
        "digit":"1234567890",
        "casesensitive":""
    }
};
