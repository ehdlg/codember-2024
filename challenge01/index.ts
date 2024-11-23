/**
 * Desafío 2: Detectando acceso no deseado

Creo que ΩMEGA está intentando entrar en el sistema. Por ahora, es un bebé y 
está siguiendo patrones muy sencillos que podemos detectar pero está intentando crear contraseñas de administrador
para acceder a la terminal.

¿Cómo podemos detectar estos intentos de acceso? Está siguiendo estos patrones:

    · Sólo usa letras minúsculas y dígitos.
    · Nunca usa dígitos después de una letra (Una vez aparecen letras,
     la contraseña debe continuar solo con letras)
    · Si usa dígitos, siempre los usa de forma igual o creciente (si sale un 3, ya no usará después un número menor)
    · Si usa letras, siempre las usa en orden alfabético igual o creciente (si sale una "b" ya no podrá usar una "a", por ejemplo)

Algunos ejemplos para que lo entiendas perfectamente:

    1234     -> true
    abc      -> true
    aabbcc   -> true (repite pero siempre ascendente)
    112233   -> true (repite pero siempre ascendente)
    a123     -> false (un número después de una letra)
    123abc   -> true
    dbce     -> false (una "d" y después una "b")

Accede a este log.txt con una lista de intentos y con un programa cuenta cuántos han sido inválidos y cuántos válidos.
 Envía la respuesta usando el comando submit.

Por ejemplo, si hay 10 intentos válidos y 5 inválidos envía el comando submit 10true5false
 */
import { getContentsFromFile as getPasswordsFromFile } from '../utils';
import path from 'node:path';

const FILE_LOG_NAME = 'log.txt';
const FILE_PATH = path.join(__dirname, FILE_LOG_NAME);

function isNumber(char: string): boolean {
  return char.length === 1 && !isNaN(Number(char)) && char.trim() !== '';
}

function isLowercase(char: string): boolean {
  return char === char.toLowerCase();
}

function validPassword(password: string): boolean {
  let lastNumber = -1;
  let lastWordCharCode: null | number = null;

  for (const letter of password) {
    if (isNumber(letter)) {
      if (null != lastWordCharCode || Number(letter) < lastNumber) return false;

      lastNumber = Number(letter);
    } else {
      const letterCharCode = letter.charCodeAt(0);
      if (!isLowercase(letter) || (null != lastWordCharCode && lastWordCharCode > letterCharCode))
        return false;

      lastWordCharCode = letterCharCode;
    }
  }

  return true;
}

async function countTries() {
  const TRIES = {
    VALID: 0,
    INVALID: 0,
  };

  try {
    const passwords = await getPasswordsFromFile(FILE_PATH);

    for (const password of passwords) {
      if (validPassword(password)) {
        TRIES.VALID = ++TRIES.VALID;
      } else {
        TRIES.INVALID = ++TRIES.INVALID;
      }
    }

    return TRIES;
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
}

async function main() {
  const tries = await countTries();

  console.log(`submit ${tries.VALID}true${tries.INVALID}false`);
}

main();
