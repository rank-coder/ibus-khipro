# Documentation
** ***For English please [scroll down](https://github.com/rank-coder/ibus-khipro/blob/master/README.md#documentation-engilsh).***
## পরিচিতি
অভ্র কিবোর্ডে ফোনেটিক লেআউটে লেখার সময় আমাদেরকে বারবার শিফট চাপতে হয়, ফলে লেখার ফ্লো বা ধারাবাহিকতা নষ্ট হয়ে যায়; লেখার গতি তাই একটা নির্দিষ্ট পরিমাণের বেশি বাড়ানো যায় না। চীনের একটা রোমানাইজেশন পদ্ধতি 'পিনইন'-এ কেস ইনসেনসিটিভ ফোনেটিক ম্যাপিং ব্যবহার করা হয়। তাই আমরা চেষ্টা করছি বাংলার রোমানাইজেশনভিত্তিক টাইপিংয়ে সেরকম দ্রুতগতি আনার। চীনে পিনইন-ভিত্তিক ইনপুট মেথড ব্যবহার করে এত জটিল একটা ভাষা ইংরেজির থেকেও দ্রুত গতিতে লিখছে। ক্ষিপ্র কিবোর্ডের ডেভেলপমেন্ট এখনো চলছে। আপনার কোনো অভিযোগ বা পরামর্শ থাকলে আমাদের সাথে যোগাযোগ করতে পারেন নিচে দেওয়া লিংকে।
## [সূচিপত্র](https://github.com/rank-coder/ibus-khipro/blob/master/README(1).md#%E0%A6%B8%E0%A7%82%E0%A6%9A%E0%A6%BF%E0%A6%AA%E0%A6%A4%E0%A7%8D%E0%A6%B0-1)
## কীভাবে কাজ করে আর কী কী ফিচার আছে
প্রথমেই বলে রাখি এখনও ক্ষিপ্র কিবোর্ডের ডেভেলপমেন্ট চলমান। তাই আইবাস-অভ্রর সাজেশন ফিচারটা অফ রেখে ব্যবহার করতে হবে। "enter key only closes the suggestion window" এই অপশনটাও বন্ধ রাখলে ভালো এবার দেখে নিই ক্ষিপ্র কিবোর্ডের ম্যাপিংটা কী রকম।

![বাংলা ইনপুট মেথড ক্ষিপ্র](https://github.com/rank-coder/ibus-khipro/assets/54497225/fdbf0f95-08b8-43b7-b6b2-de9416a95897)
## সূচিপত্র
1. [কীভাবে কাজ করে আর কী কী ফিচার আছে](https://github.com/rank-coder/ibus-khipro/blob/master/README(1).md#%E0%A6%95%E0%A7%80%E0%A6%AD%E0%A6%BE%E0%A6%AC%E0%A7%87-%E0%A6%95%E0%A6%BE%E0%A6%9C-%E0%A6%95%E0%A6%B0%E0%A7%87-%E0%A6%86%E0%A6%B0-%E0%A6%95%E0%A7%80-%E0%A6%95%E0%A7%80-%E0%A6%AB%E0%A6%BF%E0%A6%9A%E0%A6%BE%E0%A6%B0-%E0%A6%86%E0%A6%9B%E0%A7%87)
2. [স্বরবর্ণ সংক্রান্ত](https://github.com/rank-coder/ibus-khipro/blob/master/README(1).md#%E0%A6%B8%E0%A7%8D%E0%A6%AC%E0%A6%B0%E0%A6%AC%E0%A6%B0%E0%A7%8D%E0%A6%A3-%E0%A6%93-%E0%A6%95%E0%A6%BE%E0%A6%B0%E0%A6%9A%E0%A6%BF%E0%A6%B9%E0%A7%8D%E0%A6%A8-%E0%A6%B8%E0%A6%82%E0%A6%95%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%A8%E0%A7%8D%E0%A6%A4)
3. [ব্যঞ্জন্বর্ণ সংক্রান্ত](https://github.com/rank-coder/ibus-khipro/blob/master/README(1).md#%E0%A6%AC%E0%A7%8D%E0%A6%AF%E0%A6%9E%E0%A7%8D%E0%A6%9C%E0%A6%A8%E0%A6%AC%E0%A6%B0%E0%A7%8D%E0%A6%A3-%E0%A6%B8%E0%A6%82%E0%A6%95%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%A8%E0%A7%8D%E0%A6%A4)
4. [ইনস্টল ও আনইনস্টল করা](https://github.com/rank-coder/ibus-khipro/blob/master/README(1).md#%E0%A6%87%E0%A6%A8%E0%A6%B8%E0%A7%8D%E0%A6%9F%E0%A6%B2-%E0%A6%93-%E0%A6%86%E0%A6%A8%E0%A6%87%E0%A6%A8%E0%A6%B8%E0%A7%8D%E0%A6%9F%E0%A6%B2-%E0%A6%95%E0%A6%B0%E0%A6%BE)
### স্বরবর্ণ ও কারচিহ্ন সংক্রান্ত
1. যেভাবে টেবিলে দেখানো হয়েছে সেভাবেই কারচিহ্নগুলো লেখা যাবে। যেমন: ka => কা, kae = ক্যা, maepiq => ম্যাপিং, kii => কী, kw => কৃ
2. শব্দের শুরুতে স্বরচিহ্নের ম্যাপিংভুক্ত কিছু লিখলে সেটা অটো স্বরবর্ণে পরিণত হবে। যদি কোনো কারণে এই আচরণ রোধ করতে চাই তবে স্বরটি f দিয়ে শুরু করলেই স্বরচিহ্ন আসবে। যেমন: ami => আমি, fami => ামি (কখনো ভুলে কোথাও কারচিহ্ন ছুটে গেলে সেই শব্দটা না মুছেই কারচিহ্ন দিতে এই ফিচারটা কাজে লাগবে।)
3. কোনো ব্যঞ্জনের পরে কারচিহ্নের বদলে স্বরবর্ণ ব্যবহার করতে চাইলে ম্যাপিং অনুযায়ী of, af, if, iif, uf, uuf, ইত্যাদি ব্যবহার করতে হবে। যেমন: হওয়া <= hoofya, পিনইন <= pinifn, কুরআন <= kurafn ইত্যাদি। তবে পৃথায়ক ব্যবহার করেও এই কাজটি করা যায়: হওয়া <= h/ooya, পিনইন <= pin/in, কুরআন <= kur/an
4. বেশ কিছু শব্দ একাধিক উপায়ে লেখা যায়। যেমন: বই => b/i, boif, bif ইত্যাদি।
5. উচ্চারণ মাথায় রেখে লিখতে গেলে কারো কারো এভাবে লিখতে অসুবিধা হতে পারে: likhote => লিখতে। তারা বরং likh/te এভাবে লিখতে পারেন।
### ব্যঞ্জনবর্ণ সংক্রান্ত
1. পরপর দুটো ব্যঞ্জনবর্ণ লিখলে তাদের মাঝে অটো একটা হসন্ত বসে যাবে। যেমন: ব্যঞ্জন => bz/mfjon, bzomfjon ইত্যাদি। এই হসন্ত বসাটা রোধ করতে চাইলে পৃথায়ক ব্যবহার করা যাবে। যেমন: k/b/r => কবর। কিংবা, o ব্যবহার করেও একই কাজ করা যাবে: kobor => কবর
2. শব্দের শেষে ব্যঞ্জনবর্ণ এলে সেটার শেষে জোর করে হসন্ত যুক্ত করতে চাইলে xx ব্যবহার করতে হবে: কাট্ => katfxx
3. শব্দের মাঝে যুক্তবর্ণ তৈরি না করে হসন্ত দেখাতে চাইলে \` চেপে zwnj (zero width non-joiner) ব্যবহার করা যেতে পারে। যেমন: জসীম উদ্‌দীন <= josiim ud`diin
4. য-ফলা া-কারকে (্যা) স্বরধ্বনি হিসেবে স্বরবর্ণের মধ্যে উল্লেখ করা হয়েছে। সেটা এভাবে লেখা যাবে: hae => হ্যা। তবে শুধু য-ফলা লেখার জন্য z চেপে লেখার ব্যবস্থা করা হয়েছে। যেমন: hzaqq => হ্যাঁ। প্রশ্ন আসতে পারে আলাদা ae = অ্যা এর লাভ কী? এটার লাভ পাওয়া যাবে শব্দের শুরুতে। aekauntf => অ্যাকাউন্ট, aesidf => অ্যাসিড।
5. র‌্যাম সাধারণ নিয়মে লিখতে গেলে র্যাম হয়ে যায়। তাই এর জন্য আলাদা ব্যবস্থা: ryam => র‌্যাম।
6. ড্ড ও ট্ট এই যুক্তবর্ণ দুটি লিখতে সময় বেশি লাগতে পারে তাই ড্ড <= dfff, ট্ট <= tfff করার অপশন রাখা হয়েছে।
7. জ্ঞ গুরুত্বপূর্ণ যুক্তবর্ণ হওয়ায় এর জন্য আলাদা ম্যাপিং: gf => জ্ঞ। উদাহরণ: বিজ্ঞান <= bigfan.
8. য়, ড়, ঢ় এই তিনটি ব্যঞ্জনের পরে হসন্ত আসা খুবই বিরল। তাই এগুলোর পরে শুধু য-ফলা যোগ করতে গেলেই হসন্ত অটো আসবে। অন্যথায় অটো আসবে না; জোর করে আনতে হবে: য়্ক <= yxxk, হয়ত <== hoyto, বড়দা <= borfda,

## ইনস্টল ও আনইনস্টল করা
### যেকোনো লিনাক্স ডিস্ট্রোতে সোর্স থেকে বিল্ড করা
#### Fedora
Home ফোল্ডার বা ডিরেক্টরিতে গিয়ে একটা টার্মিনাল উইন্ডো খুলে সেখানে নিচের কমান্ড দিলে ক্ষিপ্র ইনস্টল হয়ে যাবে।
```
git clone https://github.com/rank-coder/ibus-khipro.git; cd ibus-khipro;  sudo dnf install automake # this installs aclocal, autoconf, and automake;  sudo dnf install ibus-devel ibus-libs  # to repair "missing ibus-1.0 error";  aclocal && autoconf && automake --add-missing;  ./configure --prefix=/usr;  sudo make install; ibus restart
```
এতে সেটিংসে ibus-avro নামে ক্ষিপ্র চলে আসবে (এখনো অভ্রের কোডে রিব্র্যান্ডিং করা হয়নি)
#### অন্যান্য ডিস্ট্রো
সোর্স থেকে বিল্ড করার জন্য নিচের প্যাকেজগুলো (অথবা আপনার ডিস্ট্রোতে এগুলোর সমকক্ষ প্যাকেজগুলো) লাগবে
```
 git
 libibus-1.0-dev
 automake
 autoconf
 make
 gjs
 ibus
```
উপরের প্যাকেজগুলো ইনস্টল করা হলে নিচের কমান্ড দিয়ে ক্ষিপ্র ইনস্টল করতে হবে:
```
git clone https://github.com/rank-coder/ibus-khipro.git; cd ibus-khipro;  aclocal && autoconf && automake --add-missing;  ./configure --prefix=/usr;  sudo make install; ibus restart
```
এবারেও সেটিংসে ibus-avro নামে ক্ষিপ্র চলে আসবে। যদি না খুঁজে পাওয়া যায় তবে ibus preferences থেকে ইনেবল করে নিতে হবে।
### আনইনস্টল করা
উপরে বর্ণিত পদ্দতিতে ইনস্টল করে থাকলে আপনার Home directory বা ফোল্ডারে একটা ibus-khipro নামে ফোল্ডার তৈরি হবে। সেই ফোল্ডারে ঢুকে:
```
sudo make uninstall
```
এই কমান্ড দিলেই ক্ষিপ্র আনইনস্টল হয়ে যাবে। তারপরেই কেবল আপনি ibus-khipro ফোল্ডারটি ডিলিট করবেন, তার আগে নয়।
# Documentation (Engilsh)
To be added...
