// Список випадкових слів для назв змінних
const randomWords = [
    'apple', 'banana', 'cherry', 'dragon', 'eagle', 'forest', 'garden', 'honey',
    'island', 'jungle', 'knight', 'lemon', 'magic', 'noble', 'ocean', 'palace',
    'queen', 'river', 'stone', 'tower', 'urban', 'voice', 'water', 'xenon',
    'yellow', 'zebra', 'brave', 'cloud', 'dream', 'flame', 'ghost', 'heart',
    'input', 'jewel', 'karma', 'light', 'mouse', 'night', 'orbit', 'peace',
    'quest', 'rapid', 'spark', 'trust', 'unity', 'vivid', 'world', 'youth'
];

let currentVariableNames = [];

// Генерація унікальних випадкових назв змінних
function generateRandomVariableNames(count) {
    const shuffled = [...randomWords].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Основна функція для розбиття посилань
function splitLinks() {
    const urls = [
        document.getElementById('urlInput1').value.trim(),
        document.getElementById('urlInput2').value.trim(),
        document.getElementById('urlInput3').value.trim()
    ].filter(url => url);

    const partsCount = parseInt(document.getElementById('partsCount').value);
    const errorDiv = document.getElementById('error');
    const outputSection = document.getElementById('outputSection');
    
    hideError();
    
    if (urls.length === 0) {
        showError('Будь ласка, введіть хоча б одне посилання');
        return;
    }
    
    // Перевірка валідності всіх URL
    for (let i = 0; i < urls.length; i++) {
        if (!isValidUrl(urls[i])) {
            showError(`Посилання ${i + 1} невалідне (має починатися з http:// або https://)`);
            return;
        }
    }
    
    // Генеруємо назви змінних
    const totalParts = urls.length * partsCount;
    currentVariableNames = generateRandomVariableNames(totalParts);
    
    // Розбиваємо кожен URL на частини
    const allParts = [];
    const urlInfos = [];
    
    urls.forEach((url, urlIndex) => {
        const parts = splitUrlIntoParts(url, partsCount);
        allParts.push({
            url: url,
            urlIndex: urlIndex,
            parts: parts
        });
        
        urlInfos.push({
            url: url,
            parts: parts,
            startIndex: urlIndex * partsCount
        });
    });
    
    // Показуємо попередній перегляд
    showUrlPreview(urlInfos);
    
    // Генеруємо код для кожної мови
    generateCSharpCode(allParts);
    generateDartCode(allParts);
    generateSwiftCode(allParts);
    generateJavaCode(allParts);
    generateKotlinCode(allParts);
    
    outputSection.style.display = 'block';
    outputSection.scrollIntoView({ behavior: 'smooth' });
}

// Перевірка валідності URL
function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
        return false;
    }
}

// Розбиття URL на задану кількість частин
function splitUrlIntoParts(url, partsCount) {
    const length = url.length;
    const partSize = Math.ceil(length / partsCount);
    const parts = [];
    
    for (let i = 0; i < partsCount; i++) {
        const start = i * partSize;
        const end = Math.min(start + partSize, length);
        const part = url.substring(start, end);
        
        if (part) {
            parts.push(part);
        }
    }
    
    return parts;
}

// Показати попередній перегляд частин URL
function showUrlPreview(urlInfos) {
    const existingPreview = document.querySelector('.url-preview');
    if (existingPreview) {
        existingPreview.remove();
    }
    
    let previewHtml = '<h3>Попередній перегляд розбиття:</h3>';
    
    urlInfos.forEach((urlInfo, urlIndex) => {
        previewHtml += `
            <div class="url-info">
                <strong>Посилання ${urlIndex + 1}:</strong> ${escapeHtml(urlInfo.url)}<br>
                <strong>Частин:</strong> ${urlInfo.parts.length}
                ${urlInfo.parts.map((part, partIndex) => {
                    const globalIndex = urlInfo.startIndex + partIndex;
                    return `<div class="url-part">${currentVariableNames[globalIndex]}: ${escapeHtml(part)}</div>`;
                }).join('')}
            </div>
        `;
    });
    
    const preview = document.createElement('div');
    preview.className = 'url-preview';
    preview.innerHTML = previewHtml;
    
    document.querySelector('.button-container').insertAdjacentElement('afterend', preview);
}

// Екранування HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Генерація коду для C#
function generateCSharpCode(allParts) {
    let constantsCode = '';
    let methodsCode = '';
    let variableIndex = 0;
    
    allParts.forEach((urlData, urlIndex) => {
        const urlVariables = [];
        
        urlData.parts.forEach((part) => {
            const varName = currentVariableNames[variableIndex];
            constantsCode += `private const string ${varName} = "${escapeString(part, 'csharp')}";\n`;
            urlVariables.push(varName);
            variableIndex++;
        });
        
        const methodName = `GetUrl${urlIndex + 1}`;
        methodsCode += `private static string ${methodName}()\n{\n    return ${urlVariables.join(' + ')};\n}\n\n`;
    });
    
    document.getElementById('csharp-constants-code').textContent = constantsCode;
    document.getElementById('csharp-methods-code').textContent = methodsCode;
}

// Генерація коду для Dart
function generateDartCode(allParts) {
    let constantsCode = '';
    let methodsCode = '';
    let variableIndex = 0;
    
    allParts.forEach((urlData, urlIndex) => {
        const urlVariables = [];
        
        urlData.parts.forEach((part) => {
            const varName = currentVariableNames[variableIndex];
            constantsCode += `static const String ${varName} = '${escapeString(part, 'dart')}';\n`;
            urlVariables.push(varName);
            variableIndex++;
        });
        
        const methodName = `getUrl${urlIndex + 1}`;
        methodsCode += `static String ${methodName}() {\n  return ${urlVariables.join(' + ')};\n}\n\n`;
    });
    
    document.getElementById('dart-constants-code').textContent = constantsCode;
    document.getElementById('dart-methods-code').textContent = methodsCode;
}

// Генерація коду для Swift
function generateSwiftCode(allParts) {
    let constantsCode = '';
    let methodsCode = '';
    let variableIndex = 0;
    
    allParts.forEach((urlData, urlIndex) => {
        const urlVariables = [];
        
        urlData.parts.forEach((part) => {
            const varName = currentVariableNames[variableIndex];
            constantsCode += `private static let ${varName} = "${escapeString(part, 'swift')}"\n`;
            urlVariables.push(varName);
            variableIndex++;
        });
        
        const methodName = `getUrl${urlIndex + 1}`;
        methodsCode += `private static func ${methodName}() -> String {\n    return ${urlVariables.join(' + ')}\n}\n\n`;
    });
    
    document.getElementById('swift-constants-code').textContent = constantsCode;
    document.getElementById('swift-methods-code').textContent = methodsCode;
}

// Генерація коду для Java
function generateJavaCode(allParts) {
    let constantsCode = '';
    let methodsCode = '';
    let variableIndex = 0;
    
    allParts.forEach((urlData, urlIndex) => {
        const urlVariables = [];
        
        urlData.parts.forEach((part) => {
            const varName = currentVariableNames[variableIndex];
            constantsCode += `private static final String ${varName} = "${escapeString(part, 'java')}";\n`;
            urlVariables.push(varName);
            variableIndex++;
        });
        
        const methodName = `getUrl${urlIndex + 1}`;
        methodsCode += `private static String ${methodName}() {\n    return ${urlVariables.join(' + ')};\n}\n\n`;
    });
    
    document.getElementById('java-constants-code').textContent = constantsCode;
    document.getElementById('java-methods-code').textContent = methodsCode;
}

// Генерація коду для Kotlin
function generateKotlinCode(allParts) {
    let constantsCode = '';
    let methodsCode = '';
    let variableIndex = 0;
    
    allParts.forEach((urlData, urlIndex) => {
        const urlVariables = [];
        
        urlData.parts.forEach((part) => {
            const varName = currentVariableNames[variableIndex];
            constantsCode += `private const val ${varName} = "${escapeString(part, 'kotlin')}"\n`;
            urlVariables.push(varName);
            variableIndex++;
        });
        
        const methodName = `getUrl${urlIndex + 1}`;
        methodsCode += `private fun ${methodName}(): String {\n    return ${urlVariables.join(' + ')}\n}\n\n`;
    });
    
    document.getElementById('kotlin-constants-code').textContent = constantsCode;
    document.getElementById('kotlin-methods-code').textContent = methodsCode;
}

// Екранування спеціальних символів для різних мов
function escapeString(str, language) {
    switch(language) {
        case 'csharp':
        case 'java':
            return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
        case 'dart':
            return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
        case 'swift':
        case 'kotlin':
            return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
        default:
            return str;
    }
}

// Переключення між табами мов
function showTab(language) {
    // Приховати всі таби мов та контент
    document.querySelectorAll('.tab:not(.file-tab)').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.code-output').forEach(output => output.classList.remove('active'));
    document.querySelectorAll('.file-tabs').forEach(tabs => tabs.style.display = 'none');
    
    // Показати обраний таб мови
    document.querySelector(`[onclick="showTab('${language}')"]`).classList.add('active');
    document.getElementById(language).classList.add('active');
    document.getElementById(language + '-tabs').style.display = 'flex';
}

// Переключення між файлами
function showFileTab(language, fileType) {
    // Приховати всі файлові таби для цієї мови
    document.querySelectorAll(`#${language}-tabs .file-tab`).forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll(`#${language} .file-content`).forEach(content => content.classList.remove('active'));
    
    // Показати обраний файловий таб
    document.querySelector(`[onclick="showFileTab('${language}', '${fileType}')"]`).classList.add('active');
    document.getElementById(`${language}-${fileType}`).classList.add('active');
}

// Копіювання в буфер обміну
function copyToClipboard(elementId) {
    const codeElement = document.querySelector(`#${elementId}-code`);
    const text = codeElement.textContent;
    
    const button = document.querySelector(`[onclick="copyToClipboard('${elementId}')"]`);
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showCopySuccess(button);
        }).catch(() => {
            fallbackCopyTextToClipboard(text, button);
        });
    } else {
        fallbackCopyTextToClipboard(text, button);
    }
}

// Альтернативний метод копіювання
function fallbackCopyTextToClipboard(text, button) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopySuccess(button);
        } else {
            showError('Не вдалося скопіювати код');
        }
    } catch (err) {
        showError('Не вдалося скопіювати код');
    }
    
    document.body.removeChild(textArea);
}

// Показати успішне копіювання
function showCopySuccess(button) {
    const originalText = button.textContent;
    const originalBackground = button.style.background;
    
    button.textContent = 'Скопійовано!';
    button.style.background = '#2ecc71';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = originalBackground || '#4CAF50';
    }, 2000);
}

// Показати помилку
function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    document.getElementById('outputSection').style.display = 'none';
    
    setTimeout(hideError, 5000);
}

// Приховати помилку
function hideError() {
    const errorDiv = document.getElementById('error');
    errorDiv.style.display = 'none';
}

// Функція для очищення форми
function clearForm() {
    document.getElementById('urlInput1').value = '';
    document.getElementById('urlInput2').value = '';
    document.getElementById('urlInput3').value = '';
    document.getElementById('outputSection').style.display = 'none';
    hideError();
    
    const preview = document.querySelector('.url-preview');
    if (preview) {
        preview.remove();
    }
}

// Обробка подій
document.addEventListener('DOMContentLoaded', function() {
    // Обробка Enter у полях вводу
    ['urlInput1', 'urlInput2', 'urlInput3'].forEach(id => {
        document.getElementById(id).addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                splitLinks();
            }
        });
        
        document.getElementById(id).addEventListener('input', function() {
            hideError();
        });
    });
    
    // Обробка зміни кількості частин
    document.getElementById('partsCount').addEventListener('change', function() {
        const outputSection = document.getElementById('outputSection');
        if (outputSection.style.display === 'block') {
            // Якщо результат вже показаний, оновити його
            const hasUrls = ['urlInput1', 'urlInput2', 'urlInput3'].some(id => 
                document.getElementById(id).value.trim()
            );
            if (hasUrls) {
                splitLinks();
            }
        }
    });
});