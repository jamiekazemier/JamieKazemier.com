from datetime import datetime, timezone
from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
index = root / 'index.html'
text = index.read_text()
stamp = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')
pattern = r'(<span id="last-edited" data-last-edited=")([^"]*)(">)(.*?)(</span>)'
replacement = rf'\g<1>{stamp}\g<3>{stamp}\g<5>'
new_text, count = re.subn(pattern, replacement, text, count=1)
if count != 1:
    raise SystemExit('last-edited span with data-last-edited not found')
index.write_text(new_text)
print(stamp)
