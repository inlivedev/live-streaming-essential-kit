/**
 * @summary A function to get the value of cookie in the client / browser side
 * @description https://stackoverflow.com/a/25346429
 * @param {string} name name / key of the cookie (case sensitive)
 * @returns {any} value of cookie
 */

const getCookie = (name) => {
  const escape = (s) => {
    return s.replace(/([.*+?\^$(){}|\[\]\/\\])/g, '\\$1');
  };
  const match = document.cookie.match(
    RegExp('(?:^|;\\s*)' + escape(name) + '=([^;]*)')
  );
  return match ? match[1] : null;
};

export default getCookie;
