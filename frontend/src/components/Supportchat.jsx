import { useEffect } from 'react';

const SupportChat = () => {
  useEffect(() => {
    // This is the specific logic provided by Tawk.to
    var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
    (function() {
      var s1 = document.createElement("script"),
          s0 = document.getElementsByTagName("script")[0];
      s1.async = true;
      // This is the unique URL from the code you were given
      s1.src = 'https://embed.tawk.to/6947bbff57dfd3198394aa23/1jd03co04';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      s0.parentNode.insertBefore(s1, s0);
    })();
  }, []);

  return null; // This component handles the background script, no UI needed
};

export default SupportChat;