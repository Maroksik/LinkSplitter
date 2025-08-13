// Список випадкових слів для назв змінних
const randomWords = [
  'algorithm', 'backend', 'compiler', 'docker', 'encryption', 'framework', 'pype', 'umity',
  'interface', 'javascript', 'kubernetes', 'library', 'microservice', 'nodejs', 'object', 'pipeline',
  'query', 'repository', 'server', 'thread', 'unicode', 'variable', 'websocket', 'map',
  'caml', 'zlib', 'build', 'cloud', 'devops', 'frontend', 'graphql', 'hashmap',
  'iterator', 'barcode', 'kotlin', 'lint', 'mutex', 'namespace', 'opcode', 'promise',
  'queue', 'runtime', 'socket', 'testing', 'unittest', 'virtualdom', 'webapp', 'yarn'
];

let currentVariableNames = [];

// Генерація унікальних випадкових назв змінних
function generateRandomVariableNames(count) {
    const shuffled = [...randomWords].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Основна функція для розбиття посилань/тексту
function splitLinks() {
    const inputs = [
        document.getElementById('urlInput1').value.trim(),
        document.getElementById('urlInput2').value.trim(),
        document.getElementById('urlInput3').value.trim()
    ].filter(input => input);

    const partsCount = parseInt(document.getElementById('partsCount').value);
    const errorDiv = document.getElementById('error');
    const outputSection = document.getElementById('outputSection');
    
    hideError();
    
    if (inputs.length === 0) {
        showError('Будь ласка, введіть хоча б один текст або посилання');
        return;
    }
    
    // Генеруємо назви змінних
    const totalParts = inputs.length * partsCount;
    currentVariableNames = generateRandomVariableNames(totalParts);
    
    // Розбиваємо кожен вхідний текст на частини
    const allParts = [];
    const inputInfos = [];
    
    inputs.forEach((input, inputIndex) => {
        const isUrl = isValidUrl(input);
        const parts = isUrl ? 
            splitUrlIntoParts(input, partsCount) : 
            splitTextIntoParts(input, partsCount);
        
        allParts.push({
            text: input,
            inputIndex: inputIndex,
            parts: parts,
            isUrl: isUrl
        });
        
        inputInfos.push({
            text: input,
            parts: parts,
            startIndex: inputIndex * partsCount,
            isUrl: isUrl
        });
    });
    
    // Показуємо попередній перегляд
    showInputPreview(inputInfos);
    
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

// Кодування тексту в base64
function encodeToBase64(text) {
    try {
        return btoa(unescape(encodeURIComponent(text)));
    } catch (error) {
        console.error('Помилка кодування в base64:', error);
        return text; // Повертаємо оригінальний текст у випадку помилки
    }
}

// Розбиття URL на задану кількість частин (зберігає логіку протоколу)
function splitUrlIntoParts(url, partsCount) {
    // Спочатку кодуємо URL в base64
    const encodedUrl = encodeToBase64(url);
    
    // Розбиваємо закодований URL на рівні частини
    return splitEncodedTextIntoParts(encodedUrl, partsCount);
}

// Розбиття звичайного тексту на рівні частини
function splitTextIntoParts(text, partsCount) {
    // Спочатку кодуємо текст в base64
    const encodedText = encodeToBase64(text);
    
    // Розбиваємо закодований текст на рівні частини
    return splitEncodedTextIntoParts(encodedText, partsCount);
}

// Розбиття закодованого тексту на рівні частини
function splitEncodedTextIntoParts(encodedText, partsCount) {
    const length = encodedText.length;
    const partSize = Math.ceil(length / partsCount);
    const parts = [];

    for (let i = 0; i < partsCount; i++) {
        const start = i * partSize;
        const end = Math.min(start + partSize, length);
        const part = encodedText.substring(start, end);

        if (part) {
            parts.push(part);
        }
    }

    return parts;
}

// Показати попередній перегляд частин
function showInputPreview(inputInfos) {
    const existingPreview = document.querySelector('.url-preview');
    if (existingPreview) {
        existingPreview.remove();
    }
    
    let previewHtml = '<h3>Попередній перегляд розбиття:</h3>';
    
    inputInfos.forEach((inputInfo, inputIndex) => {
        const typeLabel = inputInfo.isUrl ? 'URL' : 'Текст';
        const encodedText = encodeToBase64(inputInfo.text);
        
        previewHtml += `
            <div class="url-info">
                <strong>${typeLabel} ${inputIndex + 1}:</strong> ${escapeHtml(inputInfo.text)}<br>
                <strong>Base64:</strong> <span style="font-family: monospace; word-break: break-all;">${escapeHtml(encodedText)}</span><br>
                <strong>Частин:</strong> ${inputInfo.parts.length}
                ${inputInfo.parts.map((part, partIndex) => {
                    const globalIndex = inputInfo.startIndex + partIndex;
                    return `<div class="url-part">${currentVariableNames[globalIndex]}: <span style="font-family: monospace;">${escapeHtml(part)}</span></div>`;
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
    
    allParts.forEach((inputData, inputIndex) => {
        const inputVariables = [];
        
        inputData.parts.forEach((part) => {
            const varName = currentVariableNames[variableIndex];
            constantsCode += `private const string ${varName} = "${escapeString(part, 'csharp')}";\n`;
            inputVariables.push(varName);
            variableIndex++;
        });
        
        const methodName = `ConstructPath${inputIndex + 1}`;
        methodsCode += `private static string ${methodName}()\n{\n    return ${inputVariables.join(' + ')};\n}\n\nprivate static string Decode${inputIndex + 1}()\n{\n    return System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(${methodName}()));\n}\n\n`;
    });
    
    document.getElementById('csharp-constants-code').textContent = constantsCode;
    document.getElementById('csharp-methods-code').textContent = methodsCode;
}

// Генерація коду для Dart
function generateDartCode(allParts) {
    let constantsCode = '';
    let methodsCode = '';
    let variableIndex = 0;
    
    // Додаємо необхідні імпорти
    constantsCode += `import 'dart:convert';\n\n`;
    
    allParts.forEach((inputData, inputIndex) => {
        const inputVariables = [];
        
        inputData.parts.forEach((part) => {
            const varName = currentVariableNames[variableIndex];
            constantsCode += `static const String ${varName} = '${escapeString(part, 'dart')}';\n`;
            inputVariables.push(varName);
            variableIndex++;
        });
        
        const methodName = `ConstructPath${inputIndex + 1}`;
        methodsCode += `static String ${methodName}() {\n  return ${inputVariables.join(' + ')};\n}\n\nstatic String decode${inputIndex + 1}() {\n  return utf8.decode(base64.decode(${methodName}()));\n}\n\n`;
    });
    
    document.getElementById('dart-constants-code').textContent = constantsCode;
    document.getElementById('dart-methods-code').textContent = methodsCode;
}

// Генерація коду для Swift
function generateSwiftCode(allParts) {
    let constantsCode = '';
    let methodsCode = '';
    let variableIndex = 0;
    
    allParts.forEach((inputData, inputIndex) => {
        const inputVariables = [];
        
        inputData.parts.forEach((part) => {
            const varName = currentVariableNames[variableIndex];
            constantsCode += `private static let ${varName} = "${escapeString(part, 'swift')}"\n`;
            inputVariables.push(varName);
            variableIndex++;
        });
        
        const methodName = `ConstructPath${inputIndex + 1}`;
        methodsCode += `private static func ${methodName}() -> String {\n    return ${inputVariables.join(' + ')}\n}\n\nprivate static func decode${inputIndex + 1}() -> String {\n    guard let data = Data(base64Encoded: ${methodName}()) else { return "" }\n    return String(data: data, encoding: .utf8) ?? ""\n}\n\n`;
    });
    
    document.getElementById('swift-constants-code').textContent = constantsCode;
    document.getElementById('swift-methods-code').textContent = methodsCode;
}

// Генерація коду для Java
function generateJavaCode(allParts) {
    let constantsCode = '';
    let methodsCode = '';
    let variableIndex = 0;
    
    allParts.forEach((inputData, inputIndex) => {
        const inputVariables = [];
        
        inputData.parts.forEach((part) => {
            const varName = currentVariableNames[variableIndex];
            constantsCode += `private static final String ${varName} = "${escapeString(part, 'java')}";\n`;
            inputVariables.push(varName);
            variableIndex++;
        });
        
        const methodName = `ConstructPath${inputIndex + 1}`;
        methodsCode += `private static String ${methodName}() {\n    return ${inputVariables.join(' + ')};\n}\n\nprivate static String decode${inputIndex + 1}() {\n    return new String(java.util.Base64.getDecoder().decode(${methodName}()), java.nio.charset.StandardCharsets.UTF_8);\n}\n\n`;
    });
    
    document.getElementById('java-constants-code').textContent = constantsCode;
    document.getElementById('java-methods-code').textContent = methodsCode;
}

// Генерація коду для Kotlin
function generateKotlinCode(allParts) {
    let constantsCode = '';
    let methodsCode = '';
    let variableIndex = 0;
    
    allParts.forEach((inputData, inputIndex) => {
        const inputVariables = [];
        
        inputData.parts.forEach((part) => {
            const varName = currentVariableNames[variableIndex];
            constantsCode += `private const val ${varName} = "${escapeString(part, 'kotlin')}"\n`;
            inputVariables.push(varName);
            variableIndex++;
        });
        
        const methodName = `ConstructPath${inputIndex + 1}`;
        methodsCode += `private fun ${methodName}(): String {\n    return ${inputVariables.join(' + ')}\n}\n\nprivate fun decode${inputIndex + 1}(): String {\n    return String(android.util.Base64.decode(${methodName}(), android.util.Base64.DEFAULT))\n}\n\n`;
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
            const hasInputs = ['urlInput1', 'urlInput2', 'urlInput3'].some(id => 
                document.getElementById(id).value.trim()
            );
            if (hasInputs) {
                splitLinks();
            }
        }
    });
});