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

// Шифрування шифром Цезаря
function caesarCipher(text, shift) {
    return text.replace(/[a-zA-Z]/g, function(char) {
        const start = char <= 'Z' ? 65 : 97;
        const code = char.charCodeAt(0);
        let shifted = ((code - start + shift) % 26) + start;
        return String.fromCharCode(shifted);
    });
}

// Обробка тексту згідно з обраними налаштуваннями
function processText(text) {
    let processedText = text;
    
    // Крок 1: Розбиття на частини відбувається пізніше
    
    // Крок 2: Кодування в Base64 (якщо увімкнено)
    const enableBase64 = document.getElementById('enableBase64').checked;
    if (enableBase64) {
        processedText = encodeToBase64(processedText);
    }
    
    // Крок 3: Шифрування Цезарем (якщо увімкнено)
    const enableCaesar = document.getElementById('enableCaesar').checked;
    if (enableCaesar) {
        const shift = parseInt(document.getElementById('caesarShift').value) || 3;
        processedText = caesarCipher(processedText, shift);
    }
    
    return processedText;
}

// Розбиття URL на задану кількість частин
function splitUrlIntoParts(url, partsCount) {
    const processedUrl = processText(url);
    return splitProcessedTextIntoParts(processedUrl, partsCount);
}

// Розбиття звичайного тексту на рівні частини
function splitTextIntoParts(text, partsCount) {
    const processedText = processText(text);
    return splitProcessedTextIntoParts(processedText, partsCount);
}

// Розбиття обробленого тексту на рівні частини
function splitProcessedTextIntoParts(processedText, partsCount) {
    const length = processedText.length;
    const partSize = Math.ceil(length / partsCount);
    const parts = [];

    for (let i = 0; i < partsCount; i++) {
        const start = i * partSize;
        const end = Math.min(start + partSize, length);
        const part = processedText.substring(start, end);

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
        const processedText = processText(inputInfo.text);
        
        let processingSteps = `<strong>Оригінал:</strong> ${escapeHtml(inputInfo.text)}<br>`;
        
        // Показуємо кроки обробки
        const enableBase64 = document.getElementById('enableBase64').checked;
        const enableCaesar = document.getElementById('enableCaesar').checked;
        
        if (enableBase64 || enableCaesar) {
            let tempText = inputInfo.text;
            
            if (enableBase64) {
                tempText = encodeToBase64(tempText);
                processingSteps += `<strong>Base64:</strong> <span style="font-family: monospace; word-break: break-all;">${escapeHtml(tempText)}</span><br>`;
            }
            
            if (enableCaesar) {
                const shift = parseInt(document.getElementById('caesarShift').value) || 3;
                tempText = caesarCipher(tempText, shift);
                processingSteps += `<strong>Цезар (зсув ${shift}):</strong> <span style="font-family: monospace; word-break: break-all;">${escapeHtml(tempText)}</span><br>`;
            }
        }
        
        previewHtml += `
            <div class="url-info">
                <strong>${typeLabel} ${inputIndex + 1}:</strong><br>
                ${processingSteps}
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
        methodsCode += `private static string ${methodName}()\n{\n    return ${inputVariables.join(' + ')};\n}\n\nprivate static string Decode${inputIndex + 1}()\n{\n    string reconstructed = ${methodName}();\n`;
        
        // Додаємо декодування залежно від увімкнених опцій
        const enableCaesar = document.getElementById('enableCaesar').checked;
        const enableBase64 = document.getElementById('enableBase64').checked;
        
        if (enableCaesar) {
            const shift = parseInt(document.getElementById('caesarShift').value) || 3;
            methodsCode += `    // Дешифрування Цезаря\n    reconstructed = CaesarDecipher(reconstructed, ${shift});\n`;
        }
        
        if (enableBase64) {
            methodsCode += `    // Декодування Base64\n    reconstructed = System.Text.Encoding.UTF8.GetString(System.Convert.FromBase64String(reconstructed));\n`;
        }
        
        methodsCode += `    return reconstructed;\n}\n\n`;
        
        // Додаємо метод для дешифрування Цезаря, якщо потрібно
        if (enableCaesar && inputIndex === 0) {
            methodsCode += `private static string CaesarDecipher(string text, int shift)\n{\n    return new string(text.Select(ch => char.IsLetter(ch) ? \n        (char)(((ch <= 'Z' ? ch - 'A' : ch - 'a') - shift + 26) % 26 + (ch <= 'Z' ? 'A' : 'a')) : ch).ToArray());\n}\n\n`;
        }
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
        methodsCode += `static String ${methodName}() {\n  return ${inputVariables.join(' + ')};\n}\n\nstatic String decode${inputIndex + 1}() {\n  String reconstructed = ${methodName}();\n`;
        
        // Додаємо декодування залежно від увімкнених опцій
        const enableCaesar = document.getElementById('enableCaesar').checked;
        const enableBase64 = document.getElementById('enableBase64').checked;
        
        if (enableCaesar) {
            const shift = parseInt(document.getElementById('caesarShift').value) || 3;
            methodsCode += `  // Дешифрування Цезаря\n  reconstructed = caesarDecipher(reconstructed, ${shift});\n`;
        }
        
        if (enableBase64) {
            methodsCode += `  // Декодування Base64\n  reconstructed = utf8.decode(base64.decode(reconstructed));\n`;
        }
        
        methodsCode += `  return reconstructed;\n}\n\n`;
        
        // Додаємо метод для дешифрування Цезаря, якщо потрібно
        if (enableCaesar && inputIndex === 0) {
            methodsCode += `static String caesarDecipher(String text, int shift) {\n  return text.split('').map((char) {\n    if (char.codeUnitAt(0) >= 65 && char.codeUnitAt(0) <= 90) {\n      return String.fromCharCode(((char.codeUnitAt(0) - 65 - shift + 26) % 26) + 65);\n    } else if (char.codeUnitAt(0) >= 97 && char.codeUnitAt(0) <= 122) {\n      return String.fromCharCode(((char.codeUnitAt(0) - 97 - shift + 26) % 26) + 97);\n    }\n    return char;\n  }).join('');\n}\n\n`;
        }
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
        methodsCode += `private static func ${methodName}() -> String {\n    return ${inputVariables.join(' + ')}\n}\n\nprivate static func decode${inputIndex + 1}() -> String {\n    var reconstructed = ${methodName}()\n`;
        
        // Додаємо декодування залежно від увімкнених опцій
        const enableCaesar = document.getElementById('enableCaesar').checked;
        const enableBase64 = document.getElementById('enableBase64').checked;
        
        if (enableCaesar) {
            const shift = parseInt(document.getElementById('caesarShift').value) || 3;
            methodsCode += `    // Дешифрування Цезаря\n    reconstructed = caesarDecipher(reconstructed, shift: ${shift})\n`;
        }
        
        if (enableBase64) {
            methodsCode += `    // Декодування Base64\n    guard let data = Data(base64Encoded: reconstructed) else { return "" }\n    reconstructed = String(data: data, encoding: .utf8) ?? ""\n`;
        }
        
        methodsCode += `    return reconstructed\n}\n\n`;
        
        // Додаємо метод для дешифрування Цезаря, якщо потрібно
        if (enableCaesar && inputIndex === 0) {
            methodsCode += `private static func caesarDecipher(_ text: String, shift: Int) -> String {\n    return String(text.map { char in\n        if char.isLetter {\n            let base = char.isUppercase ? 65 : 97\n            let shifted = ((Int(char.asciiValue!) - base - shift + 26) % 26) + base\n            return Character(UnicodeScalar(shifted)!)\n        }\n        return char\n    })\n}\n\n`;
        }
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
        methodsCode += `private static String ${methodName}() {\n    return ${inputVariables.join(' + ')};\n}\n\nprivate static String decode${inputIndex + 1}() {\n    String reconstructed = ${methodName}();\n`;
        
        // Додаємо декодування залежно від увімкнених опцій
        const enableCaesar = document.getElementById('enableCaesar').checked;
        const enableBase64 = document.getElementById('enableBase64').checked;
        
        if (enableCaesar) {
            const shift = parseInt(document.getElementById('caesarShift').value) || 3;
            methodsCode += `    // Дешифрування Цезаря\n    reconstructed = caesarDecipher(reconstructed, ${shift});\n`;
        }
        
        if (enableBase64) {
            methodsCode += `    // Декодування Base64\n    reconstructed = new String(java.util.Base64.getDecoder().decode(reconstructed), java.nio.charset.StandardCharsets.UTF_8);\n`;
        }
        
        methodsCode += `    return reconstructed;\n}\n\n`;
        
        // Додаємо метод для дешифрування Цезаря, якщо потрібно
        if (enableCaesar && inputIndex === 0) {
            methodsCode += `private static String caesarDecipher(String text, int shift) {\n    StringBuilder result = new StringBuilder();\n    for (char c : text.toCharArray()) {\n        if (Character.isLetter(c)) {\n            int base = Character.isUpperCase(c) ? 65 : 97;\n            result.append((char) (((c - base - shift + 26) % 26) + base));\n        } else {\n            result.append(c);\n        }\n    }\n    return result.toString();\n}\n\n`;
        }
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
        methodsCode += `private fun ${methodName}(): String {\n    return ${inputVariables.join(' + ')}\n}\n\nprivate fun decode${inputIndex + 1}(): String {\n    var reconstructed = ${methodName}()\n`;
        
        // Додаємо декодування залежно від увімкнених опцій
        const enableCaesar = document.getElementById('enableCaesar').checked;
        const enableBase64 = document.getElementById('enableBase64').checked;
        
        if (enableCaesar) {
            const shift = parseInt(document.getElementById('caesarShift').value) || 3;
            methodsCode += `    // Дешифрування Цезаря\n    reconstructed = caesarDecipher(reconstructed, ${shift})\n`;
        }
        
        if (enableBase64) {
            methodsCode += `    // Декодування Base64\n    reconstructed = String(android.util.Base64.decode(reconstructed, android.util.Base64.DEFAULT))\n`;
        }
        
        methodsCode += `    return reconstructed\n}\n\n`;
        
        // Додаємо метод для дешифрування Цезаря, якщо потрібно
        if (enableCaesar && inputIndex === 0) {
            methodsCode += `private fun caesarDecipher(text: String, shift: Int): String {\n    return text.map { char ->\n        when {\n            char.isLetter() -> {\n                val base = if (char.isUpperCase()) 65 else 97\n                ((char.toInt() - base - shift + 26) % 26 + base).toChar()\n            }\n            else -> char\n        }\n    }.joinToString("")\n}\n\n`;
        }
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
    
    // Обробка зміни налаштувань шифрування
    document.getElementById('enableCaesar').addEventListener('change', function() {
        const caesarSettings = document.getElementById('caesarSettings');
        caesarSettings.style.display = this.checked ? 'block' : 'none';
        
        // Оновити результат, якщо він вже показаний
        const outputSection = document.getElementById('outputSection');
        if (outputSection.style.display === 'block') {
            const hasInputs = ['urlInput1', 'urlInput2', 'urlInput3'].some(id => 
                document.getElementById(id).value.trim()
            );
            if (hasInputs) {
                splitLinks();
            }
        }
    });
    
    // Обробка зміни Base64 кодування
    document.getElementById('enableBase64').addEventListener('change', function() {
        const outputSection = document.getElementById('outputSection');
        if (outputSection.style.display === 'block') {
            const hasInputs = ['urlInput1', 'urlInput2', 'urlInput3'].some(id => 
                document.getElementById(id).value.trim()
            );
            if (hasInputs) {
                splitLinks();
            }
        }
    });
    
    // Обробка зміни зсуву Цезаря
    document.getElementById('caesarShift').addEventListener('input', function() {
        const outputSection = document.getElementById('outputSection');
        if (outputSection.style.display === 'block') {
            const hasInputs = ['urlInput1', 'urlInput2', 'urlInput3'].some(id => 
                document.getElementById(id).value.trim()
            );
            if (hasInputs) {
                splitLinks();
            }
        }
    });
});