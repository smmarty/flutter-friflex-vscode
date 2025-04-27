import * as vscode from 'vscode';

/**
 * Регистрирует команду для добавления комментариев к классам и конструкторам
 * Dart файлов в VS Code.
 * 
 * @param {vscode.ExtensionContext} context - Контекст расширения VS Code
 */
export function registerAddClassCommentsCommand(context: vscode.ExtensionContext) {
    // Регистрация команды для добавления комментариев
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.addClassComments', async () => {
            // Получение активного редактора
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('Нет открытого редактора');
                return;
            }
            
            // Проверка, что открыт Dart файл
            if (editor.document.languageId !== 'dart') {
                vscode.window.showWarningMessage('Эта команда поддерживается только для Dart файлов');
                return;
            }
            
            // Вызов функции для добавления комментариев
            await addCommentsToClassAndConstructor(editor);
        }),
    );
}

/**
 * Добавляет комментарии к классам и конструкторам в текущем Dart файле.
 * Функция анализирует код файла, находит классы и их конструкторы,
 * и добавляет к ним документирующие комментарии, если они отсутствуют.
 * 
 * @param {vscode.TextEditor} editor - Активный редактор текста
 * @returns {Promise<void>}
 */
async function addCommentsToClassAndConstructor(editor: vscode.TextEditor): Promise<void> {
    // Получение текста документа
    const document = editor.document;
    const text = document.getText();
    
    // Регулярное выражение для поиска классов
    // Ищет класс с возможными модификаторами и наследованием
    const classRegex = /(?:abstract\s+|final\s+|sealed\s+|base\s+|interface\s+)*class\s+(\w+)(?:\s+(?:extends|with|implements)[\s\w,<>]+)?\s*\{/g;
    
    // Создание массивов для редактирования и имен классов
    let match;
    const edits: vscode.TextEdit[] = [];
    const classNames: string[] = [];
    
    // Находим все классы в документе
    while ((match = classRegex.exec(text)) !== null) {
        const className = match[1];
        const position = document.positionAt(match.index);
        const lineIndex = position.line;
        
        // Проверяем, есть ли уже комментарии перед классом
        let hasComments = false;
        for (let i = lineIndex - 1; i >= Math.max(0, lineIndex - 3); i--) {
            const line = document.lineAt(i).text.trim();
            if (line.startsWith('///') || line.startsWith('/**')) {
                hasComments = true;
                break;
            }
            // Если встретили непустую строку, но это не комментарий, то выходим
            if (line !== '') {
                break;
            }
        }
        
        // Если комментариев нет, добавляем их
        if (!hasComments) {
            // Формируем комментарий для класса с использованием {@template}
            const classComment = `/// {@template ${className}}\n/// \n/// {@endtemplate}\n`;
            const insertPosition = new vscode.Position(lineIndex, 0);
            edits.push(vscode.TextEdit.insert(insertPosition, classComment));
        }
        
        // Сохраняем имя класса для поиска конструкторов
        classNames.push(className);
    }
    
    // Находим конструкторы для всех обнаруженных классов
    for (const className of classNames) {
        // Ищем все конструкторы класса с помощью улучшенного метода
        findConstructors(text, className, document, edits);
    }
    
    // Применяем все изменения к документу
    if (edits.length > 0) {
        const workspaceEdit = new vscode.WorkspaceEdit();
        workspaceEdit.set(document.uri, edits);
        await vscode.workspace.applyEdit(workspaceEdit);
        vscode.window.showInformationMessage('Комментарии успешно добавлены');
    } else {
        vscode.window.showInformationMessage('Не найдено классов или конструкторов для комментирования');
    }
}

/**
 * Находит конструкторы класса в тексте и добавляет к ним комментарии
 * 
 * @param {string} text - Текст документа
 * @param {string} className - Имя класса
 * @param {vscode.TextDocument} document - Документ
 * @param {vscode.TextEdit[]} edits - Массив для хранения редактирований
 */
function findConstructors(text: string, className: string, document: vscode.TextDocument, edits: vscode.TextEdit[]): void {
    // Находим все вхождения имени класса
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Проверяем, является ли текущая строка конструктором
        if (isConstructor(line, className)) {
            // Проверяем, есть ли уже комментарии перед конструктором
            let hasComments = false;
            for (let j = i - 1; j >= Math.max(0, i - 3); j--) {
                const prevLine = lines[j].trim();
                if (prevLine.startsWith('///') || prevLine.startsWith('/**')) {
                    hasComments = true;
                    break;
                }
                // Если встретили непустую строку, но это не комментарий, то выходим
                if (prevLine !== '') {
                    break;
                }
            }
            
            // Если комментариев нет, добавляем их
            if (!hasComments) {
                // Формируем комментарий для конструктора с использованием {@macro}
                const constructorComment = `  /// {@macro ${className}}\n`;
                
                // Вставляем комментарий в документ
                const insertPosition = new vscode.Position(i, 0);
                edits.push(vscode.TextEdit.insert(insertPosition, constructorComment));
            }
        }
    }
}

/**
 * Проверяет, является ли строка конструктором класса
 * 
 * @param {string} line - Строка для проверки
 * @param {string} className - Имя класса
 * @returns {boolean} - true, если строка является конструктором
 */
function isConstructor(line: string, className: string): boolean {
    // Паттерн для определения конструктора
    // - может начинаться с "const", "factory" или ничего
    // - затем идет имя класса
    // - затем могут быть модификаторы (.named и т.п.)
    // - затем скобки с параметрами
    // - может заканчиваться на { или =>
    const constructorPattern = new RegExp(`^\\s*(?:const\\s+|factory\\s+)?${className}(?:\\.\\w+)?\\s*\\(.*\\)(?:\\s*:\\s*.*)?(?:\\s*\\{|\\s*=>|\\s*;)?`);
    return constructorPattern.test(line);
}