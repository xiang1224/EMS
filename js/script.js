// 讀取學生數據
async function fetchStudentData() {
    try {
        const response = await fetch('./data/data.json'); // 確保 data.json 存在
        if (!response.ok) {
            throw new Error('無法讀取數據');
        }
        return await response.json();
    } catch (error) {
        console.error('數據載入錯誤:', error);
        return [];
    }
}

// 登入功能
async function login(event) {
    // 阻止表單的默認提交行為
    event.preventDefault();

    const studentID = document.getElementById('studentID').value;
    const password = document.getElementById('password').value;
    const students = await fetchStudentData();

    const user = students.find(s => s.id === studentID && s.password === password);

    if (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));

        if (user.role === 'teacher') {
            window.location.href = './teacher.html'; // 老師進入教師頁面
        } else {
            window.location.href = './grades.html'; // 學生進入個人成績頁面
        }
    } else {
        document.getElementById('error-message').innerText = "帳號或密碼錯誤";
    }
}


// 忘記密碼的彈窗
function openModal() {
    document.getElementById("forgotModal").style.display = "block";
}

// 關閉忘記密碼彈窗
function closeForgotModal() {
    document.getElementById("forgotModal").style.display = "none";
}

// 顯示個人成績（學生專用）
function displayGrade() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!user || user.role === 'teacher') {
        window.location.href = './index.html'; // 沒登入或老師誤進就跳回首頁
        return;
    }

    document.getElementById('studentName').innerText = user.name;

    const gradesTable = document.getElementById('gradesTable');
    gradesTable.innerHTML = ""; // 清空表格

    user.grades.forEach(grade => {
        let row = `<tr><td>${grade.exam}</td><td>${grade.score}</td></tr>`;
        gradesTable.innerHTML += row;
    });

    const certificatesList = document.getElementById("certificatesList");
    certificatesList.innerHTML = ""; // 清空內容
    if (user.certificates && user.certificates.length > 0) {
        user.certificates.forEach(cert => {
            const li = document.createElement("li");
            li.textContent = cert;
            certificatesList.appendChild(li);
        });
    } else {
        certificatesList.innerHTML = "<li>尚未獲得任何證照</li>";
    }
}


// 顯示所有學生成績（老師專用）
async function displayAllGrades() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));

    // 確保是老師角色
    if (!user || user.role !== 'teacher') {
        window.location.href = './index.html'; // 如果不是老師，跳回首頁
        return;
    }

    const students = await fetchStudentData(); // 讀取學生數據

    const allGradesTable = document.getElementById('allGradesTable').getElementsByTagName('tbody')[0];
    allGradesTable.innerHTML = ''; // 清空現有的表格資料

    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${student.name}</td>
                    <td>${student.grades[0] ? student.grades[0].score : '無'}</td>
                    <td>${student.grades[1] ? student.grades[1].score : '無'}</td>
                    <td>${Array.isArray(student.certificates) && student.certificates.length > 0 ? student.certificates.join(', ') : '無'}</td>
                `;
        allGradesTable.appendChild(row);
    });
}



// 登出功能
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = './index.html';
}

// 自動顯示對應頁面內容
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes('grades.html')) {
        displayGrade();
    } else if (window.location.pathname.includes('teacher.html')) {
        displayAllGrades();
    }
});

let currentPage = 0;
const pages = [
    `
    <h3>急救的定義與重要性</h3>
    <p>急救是指在突發意外或疾病時，對患者進行的立即處置，旨在維持生命體徵、減少傷害、防止病情惡化。</p>
    <ul>
        <li>常見的急救措施包括心肺復甦術（CPR）、止血和創傷處理。</li>
        <li>學會基本的急救技巧能夠自信地應對緊急情況，並提高患者生還機會。</li>
    </ul>
    `,

    `
    <h3>現場安全與求救流程與通報技巧</h3>
    <ul>
            <li><strong>現場安全</strong>：進行急救前，首先要確保現場的安全，防止自身及他人也受到傷害。檢查事故區域，避免交通、火災、電力等危險源，必要時將傷者轉移至安全地方。</li>
            <li><strong>確認環境安全後</strong>：確保無其他危險，避免二次傷害，並採取適當的急救措施。當確保自身與傷者的安全後，接下來是進行救援行動。</li>
            <li><strong>求救流程</strong>：
                <ul>
                    <li>確認受傷者的情況，並評估是否需要撥打急救電話。</li>
                    <li>撥打當地緊急救援電話（如119、911等），清楚告知現場情況：事故地點、傷者數量、傷情描述等。</li>
                    <li>按照指示進行急救，保持冷靜並準備配合專業救援人員到場。</li>
                    <li>提供準確且詳盡的情況描述，協助救援人員了解事故並高效處置。</li>
                </ul>
            </li>
            <li><strong>通報技巧</strong>：通報時應簡潔明了，確保所提供的資訊不含混，能迅速幫助專業救援人員了解情況。</li>
        </ul>
    `,

    `
    <h3>GCS意識評估</h3>
    <p>GCS（Glasgow Coma Scale，格拉斯哥昏迷量表）用於評估患者的意識狀態，根據三個指標來量化意識水平：睜眼反應、語言反應和運動反應。</p>
    
    <h4>1. 睜眼反應（E）</h4>
    <ul>
        <li>4分：自發睜眼</li>
        <li>3分：對語音反應睜眼</li>
        <li>2分：對痛覺刺激反應睜眼</li>
        <li>1分：無反應</li>
    </ul>
    
    <h4>2. 語言反應（V）</h4>
    <ul>
        <li>5分：能夠清晰表達（正常語言）</li>
        <li>4分：語言模糊，語無倫次</li>
        <li>3分：發出不合理的聲音，無法形成語言</li>
        <li>2分：無反應，僅發出低音或呻吟聲</li>
        <li>1分：完全無語言反應</li>
    </ul>

    <h4>3. 運動反應（M）</h4>
    <ul>
        <li>6分：能對指令做出正確反應</li>
        <li>5分：對痛覺刺激作出反應</li>
        <li>4分：發出異常的動作反應</li>
        <li>3分：顯示不正常的身體反應</li>
        <li>2分：完全不動</li>
        <li>1分：無運動反應</li>
    </ul>
    <p>GCS總分範圍：3（最差）到15（最清醒）。若GCS評分為8分或以下，患者有意識喪失的危險，需立即就醫處置。</p>
    `,
    `
<h3>醫材介紹</h3>

<h4>止血帶</h4>
<p>止血帶主要用於控制嚴重出血，通常應用於四肢大出血患者。</p>
<ul>
    <li>應在緊急情況下使用，避免過長時間導致組織壞死。</li>
    <li>須標註止血帶施加時間，並儘快轉送至醫療機構。</li>
    <li>使用過程中，避免過度緊繃，應確保止血帶不會阻礙血流，並觀察患者的情況變化。</li>
    <li>長時間使用可造成局部缺血及神經損傷，應盡早轉交醫療機構處置。</li>
</ul>

<h4>EMT剪刀</h4>
<p>EMT剪刀是急救人員常用的工具，用於迅速剪開衣物以便處理傷患。</p>
<ul>
    <li>剪刀有彎曲設計，能避免直接接觸患者皮膚，防止割傷。</li>
    <li>適用於剪開繃帶、衣物及其他障礙物。</li>
    <li>在剪開衣物或包紮材料時，要注意保持剪刀鋒利及無銹。</li>
    <li>避免使用於金屬或硬物上，以防剪刀損壞。</li>
    <li>使用後應清潔消毒，避免交叉感染。</li>
</ul>

<h4>各式繃帶</h4>
<p>繃帶用於包紮傷口，提供壓力止血或固定受傷部位。</p>
<ul>
    <li>彈性繃帶：適用於扭傷或固定敷料。</li>
    <li>使用彈性繃帶時，應注意包紮壓力的適當性，過緊會影響血液循環，過鬆則無法有效固定。</li>
    <li>紗布繃帶：用於覆蓋傷口，防止感染。</li>
    <li>紗布繃帶應當乾淨無菌，防止將細菌引入傷口中。</li>
    <li>三角巾：可用於手臂吊帶或頭部包紮。</li>
    <li>使用三角巾時，要確保包紮牢固並避免過度壓迫，影響血液流動。</li>
    <li>繃帶應適當選擇大小，確保能覆蓋傷口並有效止血或固定。</li>
    <li>繃帶包紮後應檢查血液循環情況，確保受傷部位不會受到進一步壓迫。</li>
</ul>

<h4>生理監測儀</h4>
<p>生理監測儀用於快速測量患者的生命資料，包括心率、血壓、氣體測量等。</p>
<ul>
    <li>能監視患者的重要生理指標，讓醫療人員即時評估狀況。</li>
    <li>可連接監視系統，協助醫療人員監控患者的動態情況。</li>
    <li>注意定期檢查儀器，確保測量結果準確，並避免因設備故障導致誤診。</li>
    <li>在使用時，應保證儀器穩定放置並與患者良好接觸。</li>
</ul>

<h4>AMBU</h4>
<p>AMBU注氣袋是一種自然回彈的手動充氣設備，用於幫助患者呼吸。</p>
<ul>
    <li>適用於自主呼吸功能不全的患者。</li>
    <li>可連接氣道管或靠面罩，以確保穩定供氣。</li>
    <li>在使用時應避免過度壓力，避免對患者氣道造成傷害。</li>
    <li>使用後應清潔設備，保持設備的清潔和良好狀態。</li>
</ul>

<h4>喉頭鏡</h4>
<p>喉頭鏡用於檢查並打開患者的氣道，尤其在難以突出氣道狀況下幫助吸氣。</p>
<ul>
    <li>適用於氣道麻痺、單側氣道阻塞的患者。</li>
    <li>應確保操作時小心，避免損傷患者的口腔、咽喉及食道。</li>
    <li>操作時，應選擇合適大小的鏡片，並保持鏡片清潔，以提高視覺效果。</li>
    <li>使用後，應清潔並消毒喉頭鏡，防止交叉感染。</li>
</ul>

    `,
    `
    <h3>出血與止血技術</h3>
    <ul>
            <li><strong>出血分類</strong>：
                <ul>
                    <li><strong>動脈出血</strong>：血液呈現鮮紅色且有脈動噴射現象，這類出血速度快，失血量大，需及時處理。</li>
                    <li><strong>靜脈出血</strong>：血液呈現暗紅色，流動較穩定，若不及時止血，仍會導致大量失血。</li>
                    <li><strong>毛細血管出血</strong>：血液緩慢流出，通常見於小創口，雖然出血量少，但若不止血，可能導致感染或其他問題。</li>
                </ul>
            </li>
            <li><strong>止血技術</strong>：
                <ul>
                    <li><strong>壓迫止血法</strong>：
                        <ul>
                            <li>適用於所有類型的外部出血，特別是動脈性和靜脈性出血。</li>
                            <li>用乾淨的布或無菌紗布壓迫出血部位，施加直接壓力，直到出血停止。</li>
                            <li>若出血部位較大，可將布料捲成團狀並施加更多壓力，或使用手套加強保護。</li>
                        </ul>
                    </li>
                    <li><strong>止血帶使用</strong>：
                        <ul>
                            <li>當常規壓迫無法止血，且傷者處於生命危急狀況時，可以使用止血帶。</li>
                            <li>使用時，止血帶應置於傷口以上的部位，並緊密束縛，但不應過度壓迫，避免組織壞死。</li>
                            <li>注意，止血帶應持續檢查，防止血液完全中止，導致肢體壞死。</li>
                        </ul>
                    </li>
                    <li><strong>直接包紮</strong>：
                        <ul>
                            <li>使用無菌紗布或其他材料對傷口進行包紮，以減少外部污染並對傷口施加適當壓力。</li>
                            <li>包紮後定期檢查傷口狀況，確保包紮不過緊，且保持傷口乾燥。</li>
                        </ul>
                    </li>
                </ul>
            </li>
            <li><strong>休克處置</strong>：
                <ul>
                    <li>若傷者有大量出血或出現休克症狀（如呼吸急促、皮膚蒼白、冷汗等），應立即進行急救處置。</li>
                    <li>平躺、抬高雙腿、保暖並保持清醒，並儘速送醫。</li>
                </ul>
            </li>
        </ul>
    `,

    `
    <h3>包紮技術與應用</h3>
    <p>包紮是急救中至關重要的步驟，它不僅能夠止血，還能減少傷口感染，促進癒合。以下是針對不同傷勢，適用的包紮方法：</p>
    
    <h4>1. 環狀包紮（Cyclic Bandage）</h4>
    <ul>
        <li>適用傷勢：圓形或環狀傷口。</li>
        <li>方法：將繃帶繞過傷口，交錯重疊。</li>
        <li>優點：均勻分布壓力，穩固包紮。</li>
    </ul>

    <h4>2. 螺旋包紮（Spiral Bandage）</h4>
    <ul>
        <li>適用傷勢：圓形或長條形傷口。</li>
        <li>方法：將繃帶沿著傷口螺旋包裹。</li>
        <li>優點：保持彈性，便於活動。</li>
    </ul>

    <h4>3. 8字包紮（Figure-of-Eight Bandage）</h4>
    <ul>
        <li>適用傷勢：關節部位的包紮，如手腕、腳踝。</li>
        <li>方法：繞過受傷部位形成8字形。</li>
        <li>優點：加強關節穩定性。</li>
    </ul>
    <p>包紮過程中要注意選擇適合的包紮方法，並檢查包紮情況，防止過緊造成循環障礙。</p>
    `,
`
    <h3>創傷處理技術</h3>
    <p>以下是各種創傷（如刀傷、割傷、穿刺傷等）的處理方法，請根據實際情況選擇正確的處置步驟。</p>

    <!-- 刀傷處理 -->
    <h4>刀傷（切割傷）處理</h4>
    <ul>
        <li><strong>止血</strong>：
            <ul>
                <li>使用乾淨的無菌紗布或布料輕輕按壓傷口，若出血量大，可施加更多壓力。</li>
                <li>對於動脈性出血（脈動性噴血），需立即用強力壓迫傷口，並可使用止血帶或直接壓迫重要血管。</li>
            </ul>
        </li>
        <li><strong>清潔傷口</strong>：
            <ul>
                <li>用生理鹽水或無菌水沖洗傷口，避免用碘酒或酒精直接處理，這會對新組織造成傷害。</li>
                <li>若有碎片，使用乾淨的鑷子取出，但應避免過度操作，避免加重創傷。</li>
            </ul>
        </li>
        <li><strong>包紮</strong>：
            <ul>
                <li>使用無菌敷料或紗布包裹傷口，並適當加壓止血。</li>
                <li>檢查包紮情況，避免過緊導致血液循環障礙。</li>
            </ul>
        </li>
        <li><strong>觀察</strong>：
            <ul>
                <li>觀察傷口是否有異常的腫脹、紅腫或出血，若有大範圍撕裂或涉及肌肉、神經，應儘快就醫。</li>
            </ul>
        </li>
    </ul>

    <!-- 割傷處理 -->
    <h4>割傷處理</h4>
    <ul>
        <li><strong>止血</strong>：
            <ul>
                <li>對於較小的割傷，直接使用清潔的無菌紗布進行局部壓迫以止血。</li>
                <li>若割傷出血較多，可在傷口上加壓並抬高傷肢以減少血液流量。</li>
            </ul>
        </li>
        <li><strong>清潔傷口</strong>：
            <ul>
                <li>使用生理鹽水清潔割傷處，避免使用過強的消毒劑。</li>
            </ul>
        </li>
        <li><strong>包紮傷口</strong>：
            <ul>
                <li>對於小範圍的割傷，使用無菌敷料覆蓋並固定，但不過緊。</li>
            </ul>
        </li>
        <li><strong>觀察</strong>：
            <ul>
                <li>檢查傷口是否有炎症徵象，如紅腫、熱感或膿液分泌。</li>
                <li>如果傷口深且持續出血或有異物滯留，應就醫。</li>
            </ul>
        </li>
    </ul>

    <!-- 穿刺傷處理 -->
    <h4>穿刺傷處理</h4>
    <ul>
        <li><strong>止血</strong>：
            <ul>
                <li>對於穿刺傷，首先對出血部位施加壓力來止血，並觀察傷口是否持續出血。</li>
            </ul>
        </li>
        <li><strong>清潔傷口</strong>：
            <ul>
                <li>使用生理鹽水輕輕沖洗傷口，以去除任何污垢或細菌。</li>
                <li>避免拔出插入物，如果物體仍在傷口內，應保持不動並小心固定。</li>
            </ul>
        </li>
        <li><strong>包紮傷口</strong>：
            <ul>
                <li>對於較小的穿刺傷，使用無菌敷料包紮傷口，若物體已拔除，可用乾淨敷料覆蓋傷口並施加適度壓力。</li>
            </ul>
        </li>
        <li><strong>觀察與就醫</strong>：
            <ul>
                <li>穿刺傷可造成內部損傷，特別是若針頭或其他尖銳物品穿刺到重要器官或血管，應立即就醫。</li>
                <li>對於穿刺性傷口，有感染風險，因此應觀察紅腫熱痛等炎症徵象。</li>
            </ul>
        </li>
    </ul>

    <!-- 擦傷處理 -->
    <h4>擦傷處理</h4>
    <ul>
        <li><strong>止血</strong>：
            <ul>
                <li>對於擦傷，通常血液流量較小，使用乾淨紗布輕輕按壓即可。</li>
            </ul>
        </li>
        <li><strong>清潔傷口</strong>：
            <ul>
                <li>使用生理鹽水清潔擦傷處，避免使用過於刺激的消毒劑，如酒精或碘酒。</li>
            </ul>
        </li>
        <li><strong>包紮</strong>：
            <ul>
                <li>對較小的擦傷，使用無菌紗布覆蓋，避免傷口暴露。</li>
            </ul>
        </li>
        <li><strong>觀察</strong>：
            <ul>
                <li>檢查傷口是否有異常的紅腫、膿液等感染徵象。</li>
                <li>若擦傷處感染或長時間未癒合，應就醫評估。</li>
            </ul>
        </li>
    </ul>

    <!-- 擴展其他創傷類型處理 -->
    <h4>其他創傷處理</h4>
    <ul>
        <li><strong>彈道傷（槍傷、碎片傷）處理</strong>：
            <ul>
                <li>對於彈道傷，要避免將彈頭或碎片輕易移除，因為它們可能仍在造成出血或內部損傷。</li>
                <li>立即止血，使用壓迫止血法或止血帶，視情況需要儘快送醫。</li>
                <li>清潔傷口並包紮，若有呼吸道或大血管損傷，需優先處理。</li>
            </ul>
        </li>
    </ul>

`,
    `
    <h3>燒燙傷的急救處理</h3>
<ul>
            <li><strong>燒燙傷的分級</strong>：
                <ul>
                    <li><strong>一度燒傷</strong>：表層皮膚輕微紅腫，無水泡，通常自癒。建議用冷水沖洗或冷敷，並避免擠壓。</li>
                    <li><strong>二度燒傷</strong>：皮膚出現紅腫、疼痛和水泡。應立即用冷水沖洗，且避免刺破水泡，並尋求醫療協助。</li>
                    <li><strong>三度燒傷</strong>：皮膚可能變黑或白，表面無痛感，可能涉及深層組織損傷。這種情況下應該立即尋求專業醫療幫助，並注意不要用冷水處理深層燒傷。</li>
                </ul>
            </li>
            <li><strong>急救處理步驟</strong>：
                <ul>
                    <li><strong>冷卻傷口</strong>：將燒燙傷部位置於流動冷水中沖洗10-20分鐘，直到疼痛減輕為止。對大面積燒傷部位可用濕毛巾覆蓋，冷敷。</li>
                    <li><strong>防止感染</strong>：避免將燒傷區域暴露於脏物中，對於二度燒傷或三度燒傷的傷口，避免刺破水泡。</li>
                    <li><strong>包紮傷口</strong>：使用乾淨的敷料或無菌紗布輕輕包裹燒傷部位，避免過緊，以減少感染風險。</li>
                    <li><strong>保持通氣</strong>：對於大範圍燒傷的患者，保持傷者的呼吸道通暢，避免呼吸困難。</li>
                    <li><strong>休克處置</strong>：若傷者有休克徵象（如心跳加速、呼吸急促、四肢冰冷等），應儘早給予液體支持並保持傷者平躺，腳部抬高。</li>
                </ul>
            </li>
            <li><strong>注意事項</strong>：
                <ul>
                    <li>不要將冰塊直接放在燒傷部位，避免冰冷傷口造成冷傷。</li>
                    <li>對於面部或重要部位的燒燙傷，應儘速送醫處理。</li>
                    <li>若燒傷範圍較大或深層，應立即就醫進行專業治療。</li>
                </ul>
            </li>
        </ul>
    `, 

    `
    <h3>基礎治療(基礎篇)</h3>
    `,
    `
    <h3>各式創傷SOP(擦傷)</h3>
<ul>
    <li><strong>前置作業</strong>：
        <ul>
            <li>/me 檢查傷口及出血情況</li>
        </ul>
    </li>
    <li><strong>處理步驟</strong>：
        <ul>
            <li>/me 用乾淨無菌紗布輕輕按壓止血</li>
            <li>/me 用生理鹽水清潔擦傷部位</li>
            <li>/me 塗抹消炎藥膏</li>
            <li>/me 蓋上紗布後貼牢</li>
        </ul>
    </li>
    <li><strong>注意事項</strong>：
        <ul>
            <li>避免使用酒精或碘酒直接清潔傷口，這些可能會對傷口造成刺激或加劇疼痛。</li>
            <li>在清潔傷口時，避免過度摩擦，以免進一步損傷傷口。</li>
            <li>包紮後定期檢查傷口，確保紗布沒有移位，並保持傷口乾燥。</li>
        </ul>
    </li>
</ul>
    `, 
    `
    <h3>各式創傷SOP(撕裂傷)</h3>
<ul>
    <li><strong>前置作業</strong>：
        <ul>
            <li>/me 檢查傷口及出血情況</li>
        </ul>
    </li>
    <li><strong>處理步驟</strong>：
        <ul>
            <li>/me 使用生理鹽水沖洗傷口，去除血液及污染物</li>
            <li>/me 施打局部麻醉</li>
            <li>/me 縫合傷口</li>
            <li>/me 塗抹消炎藥膏</li>
            <li>/me 蓋上紗布後貼牢</li>
        </ul>
    </li>
    <li><strong>注意事項</strong>：
        <ul>
            <li>避免過度拉扯撕裂傷口邊緣，以免延遲癒合</li>
            <li>密切觀察是否有感染跡象，及時給予抗生素治療</li>
            <li>若傷口範圍過大，應及早考慮皮膚移植或手術修復</li>
        </ul>
    </li>
</ul>
    `,
    `
    <h3>各式創傷SOP(異物刺穿)</h3>
<ul>
    <li><strong>前置作業</strong>：
        <ul>
            <li>/me 評估患者的生命徵象，確保呼吸與循環穩定</li>
            <li>/me 觀察傷口大小、異物深度及出血情況</li>
            <li>/me 進行初步壓迫止血，防止失血性休克</li>
        </ul>
    </li>
    <li><strong>處理步驟</strong>：
        <ul>
            <li>/me 施打局部麻醉</li>
            <li>/me 迅速評估出血狀況，必要時使用止血帶或止血鉗控制出血</li>
            <li>/me 切開傷口，擴大術野以尋找異物及壞死組織</li>
            <li>/me 使用紗布吸收積血，確保手術視野清晰</li>
            <li>/me 小心移除爆炸碎片、骨骼碎片及壞死組織，避免進一步損傷</li>
            <li>/me 使用生理鹽水與抗生素溶液沖洗傷口，降低感染風險</li>
            <li>/me 進行血管修補，確保供血正常</li>
            <li>/me 縫合表層皮膚</li>
            <li>/me 使用無菌敷料包紮</li>
        </ul>
    </li>
    <li><strong>注意事項</strong>：
        <ul>
            <li>若異物過深且與大血管或神經緊密接觸，避免貿然取出，應轉交手術室處理</li>
            <li>觀察傷口是否有腫脹、感染徵兆，如有異常應立即進行進一步處置</li>
            <li>傷口癒合期間應避免劇烈活動，確保組織修復</li>
        </ul>
    </li>
</ul>
    `,
    `<h3>各式創傷SOP(一度燒燙傷)</h3>
    <ul>
    <li><strong>前置作業</strong>：
        <ul>
            <li>/me 檢查燒燙傷範圍與嚴重程度</li>
            <li>/me 立即移除可能持續加熱皮膚的衣物或飾品</li>
        </ul>
    </li>
    <li><strong>處理步驟</strong>：
        <ul>
            <li>/me 使用生理食鹽水將雜質沖走</li>
            <li>/me 將水泡刺破</li>
            <li>/me 塗抹燒燙傷藥膏</li>
            <li>/me 使用無菌敷料包紮</li>
        </ul>
    </li>
    <li><strong>注意事項</strong>：
        <ul>
            <li>避免使用冰塊降溫，以免造成血管收縮加重組織損傷</li>
            <li>避免塗抹牙膏、醬油或蛋白等民間療法，可能導致感染</li>
            <li>燙傷部位應避免陽光直射，以免色素沉澱或加重發炎</li>
            <li>若燒燙傷範圍過大或患者疼痛持續加重，應回診評估</li>
        </ul>
    </li>
    </ul>
    `
    ,
    `
    <h3>各式創傷SOP(二度燒燙傷)</h3>
    <ul>
    <li><strong>前置作業</strong>：
        <ul>
            <li>/me 檢查燒燙傷範圍與嚴重程度</li>
            <li>/me 立即移除可能持續加熱皮膚的衣物或飾品</li>
        </ul>
    </li>
    <li><strong>處理步驟</strong>：
        <ul>
            <li>/me 使用生理食鹽水將雜質沖走</li>
            <li>/me 施打局部麻醉</li>
            <li>/me 將水泡刺破</li>
            <li>/me 清理燒傷區域，剪除壞死皮膚</li>
            <li>/me 使用生理食鹽水與抗菌溶液沖洗燒傷部位</li>
            <li>/me 使用無菌敷料覆蓋</li>
            <li>/me 使用彈性繃帶固定燒傷包紮</li>
        </ul>
    </li>
    <li><strong>注意事項</strong>：
        <ul>
            <li>避免使用冰塊降溫，以免造成血管收縮加重組織損傷</li>
            <li>避免塗抹牙膏、醬油或蛋白等民間療法，可能導致感染</li>
            <li>燙傷部位應避免陽光直射，以免色素沉澱或加重發炎</li>
            <li>若燒燙傷範圍過大或患者疼痛持續加重，應回診評估</li>
            <li>傷口應保持清潔乾燥，若有異味、膿液滲出或紅腫加劇，應立即回診</li>
        </ul>
    </li>
    </ul>
    `,
    `
    <h3>各式創傷SOP(骨裂)</h3>
<ul>
    <li><strong>前置作業</strong>：
        <ul>
            <li>/me 觀察患肢是否有明顯變形、腫脹、瘀血或壓痛</li>
            <li>/me 進行影像學檢查（X光）</li>
        </ul>
    </li>
    <li><strong>處理步驟</strong>：
        <ul>
            <li>/me 將患部使用固定器固定，確保骨裂部位不受額外壓力</li>
        </ul>
    </li>
    <li><strong>注意事項</strong>：
        <ul>
            <li>叮嚀患者，若有腫脹，應使用冰敷（每次15-20分鐘，每日3-4次）以減少發炎</li>
            <li>若患者持續疼痛超過2週未改善，應再次進行影像學評估，以排除骨折加重</li>
            <li>避免熱敷或按摩患部，以免加重發炎與腫脹</li>
            <li>建議補充鈣質與維生素D，以促進骨骼癒合</li>
            <li>若患者為運動員或重複性勞動工作者，應調整訓練或工作強度，避免再度受傷</li>
            <li>若出現劇烈疼痛、患部異常變形、或影像顯示骨裂進一步惡化，應考慮手術治療</li>
        </ul>
    </li>
</ul>
    `,
    `
<h3>各式創傷SOP(槍傷處理 - 表皮子彈擦傷)</h3>
<ul>
    <li><strong>前置作業</strong>：
        <ul>
            <li>/me 檢查槍傷部位，確認為表淺擦傷且無貫穿</li>
            <li>/me 觀察出血狀況，若有活動性出血則立即壓迫止血</li>
            <li>/me 確認傷口周圍是否有異物殘留</li>
        </ul>
    </li>
    <li><strong>處理步驟</strong>：
        <ul>
            <li>/me 使用生理食鹽水將雜質沖走</li>
            <li>/me 使用無菌紗布輕柔擦拭傷口周圍</li>
            <li>/me 塗抹消炎藥膏</li>
            <li>/me 使用無菌敷料包紮</li>
        </ul>
    </li>
    <li><strong>注意事項</strong>：
        <ul>
            <li>避免使用酒精或碘酒直接消毒，可能刺激傷口並延緩癒合</li>
            <li>密切觀察有無局部感染徵兆，如紅腫、熱痛、膿液滲出</li>
            <li>確保患者近期有接種破傷風疫苗，若無則補打</li>
            <li>指導患者避免劇烈活動，防止傷口裂開或加重出血</li>
            <li>若出現持續性疼痛或異常腫脹，應回診評估是否有隱藏性傷害</li>
        </ul>
    </li>
</ul>

    `,
    `
        <h3>各式創傷SOP(槍傷處理 - 較深子彈擦傷)</h3>
<ul>
    <li><strong>前置作業</strong>：
        <ul>
            <li>/me 檢查槍傷部位，確認為表淺擦傷且無貫穿</li>
            <li>/me 觀察出血狀況，若有活動性出血則立即壓迫止血</li>
            <li>/me 確認傷口周圍是否有異物殘留</li>
        </ul>
    </li>
    <li><strong>處理步驟</strong>：
        <ul>
            <li>/me 使用生理食鹽水將雜質沖走</li>
            <li>/me 施打局部麻醉</li>
            <li>/me 切開傷口，擴大術野以尋找異物及壞死組織</li>
            <li>/me 使用紗布吸收積血，確保手術視野清晰</li>
            <li>/me 小心移除碎片</li>
            <li>/me 使用生理鹽水與抗生素溶液沖洗傷口</li>
            <li>/me 進行血管修補</li>
            <li>/me 縫合表層皮膚</li>
            <li>/me 使用無菌敷料包紮</li>
        </ul>
    </li>
    <li><strong>注意事項</strong>：
        <ul>
            <li>避免使用酒精或碘酒直接消毒，可能刺激傷口並延緩癒合</li>
            <li>密切觀察有無局部感染徵兆，如紅腫、熱痛、膿液滲出</li>
            <li>確保患者近期有接種破傷風疫苗，若無則補打</li>
            <li>指導患者避免劇烈活動，防止傷口裂開或加重出血</li>
            <li>若出現持續性疼痛或異常腫脹，應回診評估是否有隱藏性傷害</li>
        </ul>
    </li>
</ul>
    `,
    `
    <h3>進階治療(手術篇-待更新)</h3>
    `,
    `
    <h3>手術前置(放置氣管內管與拔除)</h3>
<ul>
    <li><strong>前置作業</strong>：
        <ul>
            <li>/me 評估患者呼吸狀況，確定有無插管適應症（呼吸衰竭、意識不清等）</li>
            <li>/me 準備必要器械</li>
            <li>/me 進行患者姿勢調整，使頭部適當後仰</li>
            <li>/me 施打鎮靜劑與肌肉鬆弛劑，減少插管不適與喉痙攣風險</li>
        </ul>
    </li>
    <li><strong>處理步驟</strong>：
        <ul>
            <li>/me 使用喉鏡打開氣道，確認聲門位置</li>
            <li>/me 將氣管內管插入氣管內，確認對位</li>
            <li>/me 充氣氣囊，確保固定氣管內管並防止漏氣</li>
            <li>/me 使用聽診確認管內位置正確</li>
            <li>/me 使用膠布或固定裝置固定氣管內管，防止滑脫</li>
        </ul>
    </li>
    <li><strong>拔管步驟</strong>：
        <ul>
            <li>/me 評估患者自主呼吸能力，確保拔管條件符合</li>
            <li>/me 清理氣道分泌物，防止拔管後嗆咳</li>
            <li>/me 放氣並迅速拔除氣管內管</li>
            <li>/me 觀察患者呼吸與血氧飽和度，確保無異常</li>
        </ul>
    </li>
    <li><strong>注意事項</strong>：
        <ul>
            <li>插管過程應小心避免齒齦損傷或食道插管</li>
            <li>術後觀察患者是否有喉頭水腫或聲音嘶啞</li>
            <li>拔管後需監測患者呼吸狀況，避免二次呼吸衰竭</li>
        </ul>
    </li>
</ul>
    `,
    `
    <h3>手術前置(放置CVC靜脈導管)</h3>
<ul>
    <li><strong>前置作業</strong>：
        <ul>
            <li>/me 評估患者血流狀況，確定放置CVC適應症</li>
            <li>/me 準備必要器材（導管、超音波機、消毒設備等）</li>
            <li>/me 進行無菌操作，減少感染風險</li>
            <li>/me 施打局部麻醉，減輕患者不適</li>
        </ul>
    </li>
    <li><strong>處理步驟</strong>：
        <ul>
            <li>/me 使用超音波或解剖定位確認靜脈位置</li>
            <li>/me 使用針頭穿刺靜脈，確認回血</li>
            <li>/me 放置導絲進入靜脈，確保位置正確</li>
            <li>/me 擴張穿刺點，插入CVC導管</li>
            <li>/me 連接導管並沖洗，確保通暢</li>
            <li>/me 縫合與固定導管，防止滑脫</li>
            <li>/me 使用X光確認導管位置</li>
        </ul>
    </li>
    <li><strong>注意事項</strong>：
        <ul>
            <li>嚴格無菌操作，降低導管相關感染風險</li>
            <li>確保導管未誤插入動脈，避免併發症</li>
            <li>術後監測患者血流與呼吸狀況</li>
        </ul>
    </li>
</ul>
    `,
    `
    <h3>手術前置(全身麻醉)</h3>
<ul>
    <li><strong>前置作業</strong>：
        <ul>
            <li>/me 連接生理監測儀</li>
        </ul>
    </li>
    <li><strong>處理步驟</strong>：
        <ul>
            <li>/me 施打鎮靜劑，誘導患者入睡</li>
            <li>/me 施打肌肉鬆弛劑，減少術中肌肉運動</li>
            <li>/me 維持麻醉深度，調整吸入麻醉劑濃度</li>
            <li>/me 監測生命徵象，確保患者安全</li>
            <li>/me 手術結束後逐步減少麻醉劑，讓患者甦醒</li>
            <li>/me 拔管並監測患者呼吸情況</li>
        </ul>
    </li>
    <li><strong>注意事項</strong>：
        <ul>
            <li>術中嚴密監測，避免麻醉過深或過淺</li>
            <li>術後觀察患者清醒狀況與併發症</li>
            <li>確保患者能自主呼吸後再拔管</li>
        </ul>
    </li>
</ul>
    `,
    `
    <h3>各式創傷SOP(骨折手術)</h3>
<ul>
    <li><strong>前置作業</strong>：
        <ul>
            <li>/me 確認患者生命徵象穩定，避免因休克影響手術</li>
            <li>/me 進行影像學檢查（X光、CT）評估骨折情況</li>
            <li>/me 清潔手術部位，減少感染風險</li>
        </ul>
    </li>
    <li><strong>處理步驟</strong>：
        <ul>
            <li>/me 施打局部或全身麻醉，減輕患者疼痛</li>
            <li>/me 使用手術刀切開骨折部位周圍的皮膚</li>
            <li>/me 使用撐開器撐開骨折部位，確保術野清晰</li>
            <li>/me 清理傷口，移除碎骨及異物，避免感染</li>
            <li>/me 使用鋼板和螺釘固定骨折部位，確保對位準確</li>
            <li>/me 縫合血管與神經，確保血流與神經功能恢復</li>
            <li>/me 將切口處的肌肉和組織依層縫合，減少術後併發症</li>
            <li>/me 縫合皮膚表面，確保傷口閉合</li>
            <li>/me 覆蓋無菌敷料，防止感染</li>
            <li>/me 放置石膏或支架固定患肢，確保骨折部位穩定</li>
        </ul>
    </li>
    <li><strong>注意事項</strong>：
        <ul>
            <li>術後監測患者的血流與神經功能，避免缺血或神經損傷</li>
            <li>手術部位需定期更換敷料，觀察有無紅腫或感染</li>
            <li>術後應根據醫囑進行復健，防止關節僵硬</li>
        </ul>
    </li>
</ul>
    `,
    `
    <h3>各式創傷SOP(槍傷處理 - 子彈嵌入)</h3>
<ul>
    <li><strong>前置作業</strong>：
        <ul>
            <li>/me 迅速評估患者的生命徵象，確保呼吸道暢通</li>
            <li>/me 檢查槍傷位置，確認子彈未貫穿</li>
            <li>/me 觀察出血狀況，必要時立即壓迫止血</li>
            <li>/me 依據槍傷部位決定是否進行快速轉送</li>
        </ul>
    </li>
    <li><strong>處理步驟</strong>：
        <ul>
            <li>/me 施打鎮痛劑或局部麻醉，減輕患者疼痛</li>
            <li>/me 若有大量出血，使用止血帶、止血夾或紗布壓迫止血</li>
            <li>/me 清理傷口周圍，避免細菌感染</li>
            <li>/me 進行影像學檢查（X光、CT）確認彈道及子彈位置</li>
            <li>/me 切開傷口，擴大術野以尋找嵌入的子彈或碎片</li>
            <li>/me 使用紗布吸收積血，確保手術視野清晰</li>
            <li>/me 小心移除彈頭或碎裂金屬，避免進一步組織損傷</li>
            <li>/me 使用生理鹽水與抗生素溶液沖洗傷口，降低感染風險</li>
            <li>/me 進行血管修補，確保供血正常</li>
            <li>/me 針測血流恢復狀況，確保無大出血後進行軟組織縫合</li>
            <li>/me 依據傷口大小決定是否放置引流管，以避免血腫</li>
            <li>/me 使用無菌敷料包紮，避免傷口二次感染</li>
        </ul>
    </li>
    <li><strong>注意事項</strong>：
        <ul>
            <li>確認槍傷是否涉及重要臟器，如肺部、中樞神經或大血管，需緊急處置</li>
            <li>避免隨意擠壓或拉扯嵌入的子彈，以防進一步損害組織</li>
            <li>觀察患者是否有失血性休克的徵兆，如低血壓、心跳加快等</li>
            <li>術後應進行抗生素治療，降低感染風險</li>
            <li>術後應持續監測是否有內出血或併發症，如肺部塌陷或氣胸</li>
        </ul>
    </li>
</ul>
    `,
    
];


// 打開電子書
function openEbook() {
    document.getElementById("ebookModal").style.display = "block";
    document.getElementById("pageText").innerHTML = pages[currentPage]; // 使用 innerHTML 來顯示 HTML 格式內容
}



// 關閉電子書
function closeEbook() {
    document.getElementById("ebookModal").style.display = "none";
}

// 上一頁
function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        document.getElementById("pageText").innerHTML = pages[currentPage];
    }
}

// 下一頁
function nextPage() {
    if (currentPage < pages.length - 1) {
        currentPage++;
        document.getElementById("pageText").innerHTML = pages[currentPage];
    }
}
