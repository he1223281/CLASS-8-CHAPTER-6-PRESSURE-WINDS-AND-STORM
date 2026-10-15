import html,sys
N=[(0,'1757','Plassey','The Company defeats the Nawab of Bengal. The foundation of British rule.'),
(0,'1857','Uprising','The Great National Uprising: Mangal Pandey, Rani Laxmibai, Tatya Tope… crushed, but not forgotten.'),
(0,'1858','Crown rule','Company rule ends. India is ruled by the British Crown (Queen Victoria).'),
(1,'1905','Bengal divided','16 Oct: Curzon divides Bengal. National Mourning Day, rakhis, Swadeshi and Boycott.'),
(1,'1906','Muslim League','Formed with British encouragement (Minto, Morley): divide and rule.'),
(1,'1907','Surat · Stuttgart','Congress splits into Jahal and Maval at Surat. Madam Cama hoists the national flag at Stuttgart.'),
(1,'1909','Morley-Minto','Morley-Minto Reforms. 13 Nov: bomb thrown at Viceroy Minto, Raipur Darwaja, Ahmedabad.'),
(1,'1911','Partition cancelled','United effort wins: the Partition of Bengal is cancelled.'),
(2,'1915','Gandhiji returns','Back from South Africa with satyagraha. Gurus: Gokhale and Shrimad Rajchandra.'),
(2,'1919','Rowlatt Act','The Black Act: arrest and jail without trial.'),
(2,'13 Apr 1919','Jallianwala','Dyer fires on a peaceful Baisakhi meeting in Amritsar. Govt: 379 dead; Congress: 1,000.'),
(2,'1919–20','Khilafat','Ali brothers lead; Gandhiji brings Congress support for Hindu-Muslim unity.'),
(2,'Dec 1920','Nagpur','Congress approves Non-Co-operation. Demand: Swarajya, not Swashasan.'),
(2,'1921','Boycotts','Titles returned, students leave schools, foreign cloth burnt, royal visits boycotted, ₹1 crore Tilak Fund.'),
(2,'1922','Chauri Chaura','Violence at Chauri Chaura; Gandhiji withdraws the movement: a “Himalayan blunder”.'),
(3,'1923','Swarajya Party','C.R. Das and Motilal Nehru’s party wins a clear majority in the legislatures.'),
(3,'1925','C.R. Das dies','June 1925: the party weakens; a split creates the National Party.'),
(3,'1926','Defeat','The Swarajists lose badly except in Madras Province.')]
out=[]; n=len(N)
for i,(e,y,l,d) in enumerate(N):
    left=100*i/(n-1); ud='up' if i%2==0 else 'dn'
    dd='<b style="font-family:var(--f-type);color:var(--saffron-soft)">%s · %s</b> — %s'%(y,l,d)
    out.append('<div class="nd %s" data-era="%d" style="left:%.2f%%"><button type="button" aria-label="%s %s" data-d="%s"></button><div class="lbl"><span class="yr">%s</span>%s</div></div>'%(ud,e,left,html.escape(y),html.escape(l),html.escape(dd,quote=True),y,l))
s=open('slides.html',encoding='utf-8').read().replace('TIMELINE_NODES','\n    '.join(out))
open('slides.final.html','w',encoding='utf-8').write(s)
