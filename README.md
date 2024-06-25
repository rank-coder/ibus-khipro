![বাংলা ইনপুট মেথড ক্ষিপ্র (Copy)](https://github.com/rank-coder/ibus-khipro/assets/54497225/51f36cf2-844f-4930-b04d-40ec6ddf8f8d)# Documentation
*For English please [scroll down](https://github.com/rank-coder/ibus-khipro/tree/master?tab=readme-ov-file#documentation-engilsh).*
## পরিচিতি
অভ্র কিবোর্ডে ফোনেটিক লেআউটে লেখার সময় আমাদেরকে বারবার শিফট চাপতে হয়, ফলে লেখার ফ্লো বা ধারাবাহিকতা নষ্ট হয়ে যায়; লেখার গতি তাই একটা নির্দিষ্ট পরিমাণের বেশি বাড়ানো যায় না। চীনের একটা রোমানাইজেশন পদ্ধতি 'পিনইন'-এ কেস ইনসেনসিটিভ ফোনেটিক ম্যাপিং ব্যবহার করা হয়। তাই আমরা চেষ্টা করছি বাংলার রোমানাইজেশনভিত্তিক টাইপিংয়ে সেরকম দ্রুতগতি আনার। চীনে পিনইন-ভিত্তিক ইনপুট মেথড ব্যবহার করে তারা এত জটিল একটা ভাষাকে ইংরেজির চাইতেও দ্রুত গতিতে লিখছে।<br> ক্ষিপ্র কিবোর্ডের ডেভেলপমেন্ট এখনো চলছে। আপনার কোনো অভিযোগ বা পরামর্শ থাকলে আমাদের সাথে যোগাযোগ করতে পারেন নিচে দেওয়া [লিংকে](https://github.com/rank-coder/ibus-khipro/tree/master?tab=readme-ov-file#%E0%A6%86%E0%A6%AE%E0%A6%BE%E0%A6%A6%E0%A7%87%E0%A6%B0-%E0%A6%B8%E0%A6%BE%E0%A6%A5%E0%A7%87-%E0%A6%AF%E0%A7%8B%E0%A6%97%E0%A6%BE%E0%A6%AF%E0%A7%8B%E0%A6%97)।
#### [সূচিপত্র দেখতে এখানে ক্লিক করুন](https://github.com/rank-coder/ibus-khipro/tree/master?tab=readme-ov-file#%E0%A6%B8%E0%A7%82%E0%A6%9A%E0%A6%BF%E0%A6%AA%E0%A6%A4%E0%A7%8D%E0%A6%B0)
## কীভাবে কাজ করে আর কী কী ফিচার আছে
প্রথমেই বলে রাখি এখনও ক্ষিপ্র কিবোর্ডের ডেভেলপমেন্ট চলমান। তাই আইবাস-অভ্রর ডিকশনারি সাজেশন ফিচারটা অফ রেখে ব্যবহার করতে হবে। "enter key only closes the suggestion window" এই অপশনটাও বন্ধ রাখলে ভালো। আমি নিচের মতো রাখি:
![Screenshot from 2024-06-22 22-19-24](https://github.com/rank-coder/ibus-khipro/assets/54497225/3e73cb68-74a0-4f64-ad08-0ab0b38e9400)
<br> <br>
এবার দেখে নিই ক্ষিপ্র কিবোর্ডের ম্যাপিংটা কী রকম। <br> <br>
![বাংলা ইনপুট মেথড ক্ষিপ্র (Copy)](https://github.com/rank-coder/ibus-khipro/assets/54497225/32a4d13a-370b-4183-b790-2d24077ae043)

## সূচিপত্র
1. [কীভাবে কাজ করে আর কী কী ফিচার আছে](https://github.com/rank-coder/ibus-khipro/tree/master?tab=readme-ov-file#%E0%A6%95%E0%A7%80%E0%A6%AD%E0%A6%BE%E0%A6%AC%E0%A7%87-%E0%A6%95%E0%A6%BE%E0%A6%9C-%E0%A6%95%E0%A6%B0%E0%A7%87-%E0%A6%86%E0%A6%B0-%E0%A6%95%E0%A7%80-%E0%A6%95%E0%A7%80-%E0%A6%AB%E0%A6%BF%E0%A6%9A%E0%A6%BE%E0%A6%B0-%E0%A6%86%E0%A6%9B%E0%A7%87)
2. [স্বরবর্ণ সংক্রান্ত](https://github.com/rank-coder/ibus-khipro/tree/master?tab=readme-ov-file#%E0%A6%B8%E0%A7%8D%E0%A6%AC%E0%A6%B0%E0%A6%AC%E0%A6%B0%E0%A7%8D%E0%A6%A3-%E0%A6%93-%E0%A6%95%E0%A6%BE%E0%A6%B0%E0%A6%9A%E0%A6%BF%E0%A6%B9%E0%A7%8D%E0%A6%A8-%E0%A6%B8%E0%A6%82%E0%A6%95%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%A8%E0%A7%8D%E0%A6%A4)
3. [ব্যঞ্জনবর্ণ সংক্রান্ত](https://github.com/rank-coder/ibus-khipro/tree/master?tab=readme-ov-file#%E0%A6%AC%E0%A7%8D%E0%A6%AF%E0%A6%9E%E0%A7%8D%E0%A6%9C%E0%A6%A8%E0%A6%AC%E0%A6%B0%E0%A7%8D%E0%A6%A3-%E0%A6%B8%E0%A6%82%E0%A6%95%E0%A7%8D%E0%A6%B0%E0%A6%BE%E0%A6%A8%E0%A7%8D%E0%A6%A4)
4. [ইনস্টল, আপডেট, ও আনইনস্টল করা](https://github.com/rank-coder/ibus-khipro/tree/master?tab=readme-ov-file#%E0%A6%87%E0%A6%A8%E0%A6%B8%E0%A7%8D%E0%A6%9F%E0%A6%B2-%E0%A6%86%E0%A6%AA%E0%A6%A1%E0%A7%87%E0%A6%9F-%E0%A6%93-%E0%A6%86%E0%A6%A8%E0%A6%87%E0%A6%A8%E0%A6%B8%E0%A7%8D%E0%A6%9F%E0%A6%B2-%E0%A6%95%E0%A6%B0%E0%A6%BE)
### স্বরবর্ণ ও কারচিহ্ন সংক্রান্ত
1. যেভাবে টেবিলে দেখানো হয়েছে সেভাবেই কারচিহ্নগুলো লেখা যাবে। যেমন: ka => কা, kae => ক্যা, maepiq => ম্যাপিং, kii => কী, kw => কৃ, kv => কো, koo => কো
2. ঐতিহ্যবাহী ও আধুনিক স্টাইলের কারচিহ্ন: কিছু কিছু ব্যঞ্জনে পুরাতন স্টাইলের ু, ূ, ৃ কার যুক্ত হয়। চিত্র: ![ছবি](https://github.com/rank-coder/ibus-khipro/assets/54497225/c5fd0724-b2c1-4058-a2ce-b9c59c7c4908)  আপনি চাইলে আধুনিক স্টাইলের কারচিহ্ন বানাতে পারবেন সেই কারচিহ্নর শেষে ff যোগ করার মাধ্যমে। তখন এরকম কারচিহ্ন দেখা যাবে: ![ছবি](https://github.com/rank-coder/ibus-khipro/assets/54497225/37a339cc-e651-4723-82a1-ff7115078a0b)
উদাহরণ: ru => রু, ruff => র‌ু 
4. শব্দের শুরুতে স্বরচিহ্নের ম্যাপিংভুক্ত কিছু লিখলে সেটা অটো স্বরবর্ণে পরিণত হবে। যদি কোনো কারণে এই আচরণ রোধ করতে চাই তবে স্বরটি f দিয়ে শুরু করলেই স্বরচিহ্ন আসবে। যেমন: ami => আমি, fami => ামি (কখনো ভুলে কোথাও কারচিহ্ন ছুটে গেলে সেই শব্দটা না মুছেই কারচিহ্ন দিতে এই ফিচারটা কাজে লাগবে।)
5. কোনো ব্যঞ্জনের পরে কারচিহ্নের বদলে স্বরবর্ণ ব্যবহার করতে চাইলে ম্যাপিং অনুযায়ী of, af, if, iif, uf, uuf, ইত্যাদি ব্যবহার করতে হবে। যেমন: হওয়া <== hvfya, hoofya, পিনইন <== pinifn, কুরআন <== kurafn ইত্যাদি। তবে পৃথায়ক ব্যবহার করেও এই কাজটি করা যায়: হওয়া <== h;vya, h;ooya, পিনইন <== pin;in, কুরআন <== kur;an
6. বেশ কিছু শব্দ একাধিক উপায়ে লেখা যায়। যেমন: বই => b;i, boif, bif ইত্যাদি।
7. উচ্চারণ মাথায় রেখে লিখতে গেলে কারো কারো এভাবে লিখতে অসুবিধা হতে পারে: likhote => লিখতে। তারা বরং পৃথায়ক ব্যবহার করে likh;te এভাবে লিখতে পারেন। ভবিষ্যতে কোনো আপডেটে kht লিখলে যাতে খ্ত না হয় সেই ব্যবস্থা করা হবে।
### ব্যঞ্জনবর্ণ সংক্রান্ত
1. পরপর দুটো ব্যঞ্জনবর্ণ লিখলে তাদের মাঝে অটো একটা হসন্ত বসে যাবে। যেমন: ব্যঞ্জন => bz;mfjon, bzomfjon ইত্যাদি। এই হসন্ত বসাটা রোধ করতে চাইলে পৃথায়ক ব্যবহার করা যাবে। যেমন: k;b;r => কবর। কিংবা, o ব্যবহার করেও একই কাজ করা যাবে: kobor => কবর
2. শব্দের শেষে ব্যঞ্জনবর্ণ এলে সেটার শেষে জোর করে হসন্ত যুক্ত করতে চাইলে xx ব্যবহার করতে হবে: কাট্ => katfxx
3. শব্দের মাঝে যুক্তবর্ণ তৈরি না করে হসন্ত দেখাতে চাইলে \` চেপে zwnj (zero width non-joiner) ব্যবহার করা যেতে পারে। যেমন: জসীম উদ্‌দীন <== josiim ud`diin
4. য-ফলা া-কারকে (্যা) স্বরধ্বনি হিসেবে স্বরবর্ণের মধ্যে উল্লেখ করা হয়েছে। সেটা এভাবে লেখা যাবে: hae => হ্যা। তবে শুধু য-ফলা লেখার জন্য z চেপে লেখার ব্যবস্থা করা হয়েছে। যেমন: hza => হ্যা। প্রশ্ন আসতে পারে আলাদা ae = অ্যা এর লাভ কী? এটার লাভ পাওয়া যাবে শব্দের শুরুতে। aekauntf => অ্যাকাউন্ট, aesidf => অ্যাসিড।
5. র‌্যাম সাধারণ নিয়মে লিখতে গেলে র্যাম হয়ে যায়। তাই এর জন্য আলাদা ব্যবস্থা: ryam => র‌্যাম।
6. ড্ড ও ট্ট এই যুক্তবর্ণ দুটি লিখতে সময় বেশি লাগতে পারে তাই ড্ড <== ddf, ট্ট <== ttf করার অপশন রাখা হয়েছে।
7. জ্ঞ গুরুত্বপূর্ণ যুক্তবর্ণ হওয়ায় এর জন্য আলাদা ম্যাপিং: ggg => জ্ঞ। উদাহরণ: বিজ্ঞান <== bigggan. এরকম আরও কিছু যুক্তবর্ণের জন্য স্পেশাল ম্যাপিং আছে।
8. য়, ড়, ঢ় এই তিনটি ব্যঞ্জনের পরে হসন্ত আসা খুবই বিরল। তাই এগুলোর পরে শুধু য-ফলা যোগ করতে গেলেই হসন্ত অটো আসবে। অন্যথায় অটো আসবে না; জোর করে আনতে হবে: য়্ক <== yxxk, হয়ত <== hoyto, বড়দা <== borfda <br> এরকম আরও কিছু বর্ণ আছে যারা পাশাপাশি এলে কখন যুক্তবর্ণ আকারে আসে না। সেগুলো যাতে ক্ষিপ্রতে অটো যুক্তবর্ণ না হয়ে যায় সেই ব্যবস্থা করা হবে।

## ইনস্টল, আপডেট, ও আনইনস্টল করা
### যেকোনো লিনাক্স ডিস্ট্রোতে সোর্স থেকে বিল্ড করা
যেকোনো লিনাক্স ডিস্ট্রোতে ইনস্টল করার পরে সাজেশন অফ করে নিবেন। কারণ সাজেশন চালু থাকলে অভ্রের কোড ঝামেলা (ইন্টারফিয়ার) করতে পারে।
#### ফেদোরা Fedora
Home ফোল্ডার বা ডিরেক্টরিতে গিয়ে একটা টার্মিনাল উইন্ডো খুলে সেখানে নিচের কমান্ড দিলে ক্ষিপ্র ইনস্টল হয়ে যাবে।
```
git clone https://github.com/rank-coder/ibus-khipro.git; cd ibus-khipro;  sudo dnf install automake; sudo dnf install make;  sudo dnf install ibus-devel ibus-libs;  aclocal && autoconf && automake --add-missing;  ./configure --prefix=/usr;  sudo make install; ibus restart
```
এতে সেটিংসে ibus-avro নামে ক্ষিপ্র চলে আসবে (এখনো অভ্রের কোডে রিব্র্যান্ডিং করা হয়নি)<br>
ফেদোরাতে উপরের নিয়ম কাজ না করলে নিচের নিয়মে চেষ্টা করতে পারেন।
#### যেকোনো ডিস্ট্রো
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
এই প্যাকেজগুলো উবুন্টু, ডেবিয়ান, লিনাক্স মিন্ট, পপ OS, জরিন, ইত্যাদি এজাতীয় ডিস্ট্রোতে এক কমান্ডে ইনস্টল করতে:
```
 sudo apt install git libibus-1.0-dev automake autoconf make gjs ibus
```
উপরের প্যাকেজগুলো ইনস্টল করা হলে নিচের কমান্ড দিয়ে ক্ষিপ্র ইনস্টল করতে হবে:
```
git clone https://github.com/rank-coder/ibus-khipro.git; cd ibus-khipro;  aclocal && autoconf && automake --add-missing;  ./configure --prefix=/usr;  sudo make install; ibus restart
```
এবারেও সেটিংসে ibus-avro নামে ক্ষিপ্র চলে আসবে। যদি না খুঁজে পাওয়া যায় তবে ibus preferences থেকে ইনেবল করে নিতে হবে।
ক্ষিপ্র ইনস্টল করার পদ্ধতি অভ্র ইনস্টল করার মতোই, যেহেতু এটা অভ্রেরই ফর্ক। তাই অভ্র ইনস্টল করার পদ্ধতিটা দেখে নিতে পারেন: https://github.com/sarim/ibus-avro?tab=readme-ov-file#installation
### আপডেট করা
আপডেট করতে হলে আগে আনইনস্টল করতে হবে তারপরে আবার ইনস্টল করতে হবে।<br>
উপরের কমান্ড দিয়ে ইনস্টল করে থাকলে সকল ডিস্ট্রোতে এক কমান্ডে আপডেট করতে নিচের কমান্ড ব্যবহার করতে পারবেন:
```
cd ~/ibus-khipro; sudo make uninstall; cd ~/; rm -rf ibus-khipro; git clone https://github.com/rank-coder/ibus-khipro.git; cd ibus-khipro;  aclocal && autoconf && automake --add-missing;  ./configure --prefix=/usr;  sudo make install; ibus restart
```
### আনইনস্টল করা
উপরে বর্ণিত পদ্ধতিতে ইনস্টল করে থাকলে আপনার Home directory বা ফোল্ডারে একটা ibus-khipro নামে ফোল্ডার তৈরি হবে। সেই ফোল্ডারে ঢুকে:
```
sudo make uninstall
```
এই কমান্ড দিলেই ক্ষিপ্র আনইনস্টল হয়ে যাবে। তারপরেই কেবল আপনি ibus-khipro ফোল্ডারটি ডিলিট করবেন, তার আগে নয়।
## আমাদের সাথে যোগাযোগ
* বাংলা ইনপুট মেথড প্রকল্প গ্রুপ: https://t.me/+oXLVpYDtyDNmYzll
* বাংলা লোকালাইজেশন কমিউনিটি গ্রুপ: https://t.me/BanglaLocalizationCommunity
* লিনাক্স বাংলা গ্রুপ: https://t.me/linux_bangla
# Documentation (Engilsh)
To be added...
## Contact us...
* The Bangla Input Method Project Group: https://t.me/+oXLVpYDtyDNmYzll
* Bangla Localization Community Group: https://t.me/BanglaLocalizationCommunity
* Linux Bangla Group: https://t.me/linux_bangla
