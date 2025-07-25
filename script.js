// Основна функція для розбиття посилання
function splitLink() {
    const url = document.getElementById('urlInput').value.trim();
    const partsCount = parseInt(document.getElementById('partsCount').value);
    const errorDiv = document.getElementById('error');
    const outputSection = document.getElementById('outputSection');
    
    // Очистити попередні помилки
    hideError();
    
    if (!url) {
        showError('Будь ласка, введіть посилання');
        return;
    }
    
    if (!isValidUrl(url)) {
        showError('Будь ласка, введіть валідне посилання (має починатися з http:// або https://)');
        return;
    }
    
    // Розбити URL на частини
    const parts = splitUrlIntoParts(url, partsCount);
    
    // Показати попередній перегляд частин
    showUrlPreview(parts);
    
    // Генерувати код для кожної мови
    generateCSharpCode(parts);
    generateDartCode(parts);
    generateSwiftCode(parts);
    
    // Показати результат
    outputSection.style.display = 'block';
    
    // Прокрутити до результатів
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
        
        if (part) { // Додаємо тільки непорожні частини
            parts.push(part);
        }
    }
    
    return parts;
}

// Показати попередній перегляд частин URL
function showUrlPreview(parts) {
    const existingPreview = document.querySelector('.url-preview');
    if (existingPreview) {
        existingPreview.remove();
    }
    
    const preview = document.createElement('div');
    preview.className = 'url-preview';
    preview.innerHTML = `
        <h3>Частини URL (всього: ${parts.length}):</h3>
        ${parts.map((part, index) => 
            `<div class="url-part">Частина ${index + 1}: ${escapeHtml(part)}</div>`
        ).join('')}
    `;
    
    document.querySelector('.button-container').insertAdjacentElement('afterend', preview);
}

// Екранування HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Генерація коду для C#
function generateCSharpCode(parts) {
    let code = '// C# Private Constants\n';
    code += 'using System;\n\n';
    code += 'public class UrlConstants\n{\n';
    
    parts.forEach((part, index) => {
        code += `    private const string Part${index + 1} = "${escapeString(part, 'csharp')}";\n`;
    });
    
    code += '\n    public static string GetFullUrl()\n    {\n';
    code += '        return ' + parts.map((_, index) => `Part${index + 1}`).join(' + ') + ';\n';
    code += '    }\n\n';
    
    code += '    // Метод для отримання окремої частини\n';
    code += '    public static string GetPart(int partNumber)\n    {\n';
    code += '        return partNumber switch\n        {\n';
    parts.forEach((_, index) => {
        code += `            ${index + 1} => Part${index + 1},\n`;
    });
    code += '            _ => throw new ArgumentOutOfRangeException(nameof(partNumber))\n';
    code += '        };\n    }\n';
    code += '}';
    
    document.getElementById('csharp-code').textContent = code;
}

// Генерація коду для Dart
function generateDartCode(parts) {
    let code = '// Dart Private Constants\n';
    code += 'class UrlConstants {\n';
    
    parts.forEach((part, index) => {
        code += `  static const String _part${index + 1} = '${escapeString(part, 'dart')}';\n`;
    });
    
    code += '\n  static String getFullUrl() {\n';
    code += '    return ' + parts.map((_, index) => `_part${index + 1}`).join(' + ') + ';\n';
    code += '  }\n\n';
    
    code += '  // Метод для отримання окремої частини\n';
    code += '  static String getPart(int partNumber) {\n';
    code += '    switch (partNumber) {\n';
    parts.forEach((_, index) => {
        code += `      case ${index + 1}: return _part${index + 1};\n`;
    });
    code += '      default: throw ArgumentError(\'Invalid part number: $partNumber\');\n';
    code += '    }\n  }\n\n';
    
    code += '  // Список всіх частин\n';
    code += '  static List<String> getAllParts() {\n';
    code += '    return [' + parts.map((_, index) => `_part${index + 1}`).join(', ') + '];\n';
    code += '  }\n';
    code += '}';
    
    document.getElementById('dart-code').textContent = code;
}

// Генерація коду для Swift
function generateSwiftCode(parts) {
    let code = '// Swift Private Constants\n';
    code += 'import Foundation\n\n';
    code += 'class UrlConstants {\n';
    
    parts.forEach((part, index) => {
        code += `    private static let part${index + 1} = "${escapeString(part, 'swift')}"\n`;
    });
    
    code += '\n    static func getFullUrl() -> String {\n';
    code += '        return ' + parts.map((_, index) => `part${index + 1}`).join(' + ') + '\n';
    code += '    }\n\n';
    
    code += '    // Метод для отримання окремої частини\n';
    code += '    static func getPart(_ partNumber: Int) -> String? {\n';
    code += '        switch partNumber {\n';
    parts.forEach((_, index) => {
        code += `        case ${index + 1}: return part${index + 1}\n`;
    });
    code += '        default: return nil\n';
    code += '        }\n    }\n\n';
    
    code += '    // Масив всіх частин\n';
    code += '    static var allParts: [String] {\n';
    code += '        return [' + parts.map((_, index) => `part${index + 1}`).join(', ') + ']\n';
    code += '    }\n';
    code += '}';
    
    document.getElementById('swift-code').textContent = code;
}

// Екранування спеціальних символів для різних мов
function escapeString(str, language) {
    switch(language) {
        case 'csharp':
            return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
        case 'dart':
            return str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
        case 'swift':
            return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
        default:
            return str;
    }
}

// Переключення між табами
function showTab(language) {
    // Приховати всі таби та контент
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.code-output').forEach(output => output.classList.remove('active'));
    
    // Показати обраний таб
    event.target.classList.add('active');
    document.getElementById(language).classList.add('active');
}

// Копіювання в буфер обміну
function copyToClipboard(language) {
    const codeElement = document.querySelector(`#${language}-code`);
    const text = codeElement.textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showCopySuccess(event.target);
        }).catch(() => {
            fallbackCopyTextToClipboard(text, event.target);
        });
    } else {
        fallbackCopyTextToClipboard(text, event.target);
    }
}

// Альтернативний метод копіювання (для старих браузерів)
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
    
    // Приховати помилку через 5 секунд
    setTimeout(hideError, 5000);
}

// Приховати помилку
function hideError() {
    const errorDiv = document.getElementById('error');
    errorDiv.style.display = 'none';
}

// Обробка подій
document.addEventListener('DOMContentLoaded', function() {
    // Обробка Enter у полі вводу
    document.getElementById('urlInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            splitLink();
        }
    });
    
    // Автоматичне приховання помилок при введенні тексту
    document.getElementById('urlInput').addEventListener('input', function() {
        hideError();
    });
    
    // Обробка зміни кількості частин
    document.getElementById('partsCount').addEventListener('change', function() {
        const outputSection = document.getElementById('outputSection');
        if (outputSection.style.display === 'block') {
            // Якщо результат вже показаний, оновити його
            const url = document.getElementById('urlInput').value.trim();
            if (url) {
                splitLink();
            }
        }
    });
});

// Функція для очищення форми
function clearForm() {
    document.getElementById('urlInput').value = '';
    document.getElementById('outputSection').style.display = 'none';
    hideError();
    
    const preview = document.querySelector('.url-preview');
    if (preview) {
        preview.remove();
    }
}