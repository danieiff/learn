X: csv, tsv
- 自分でreader/writerを書かない
- dictと相性が悪い
O: JSON Lines
- json.dumps json.loads で読み書き

assertion

O: argparse (reusable of code) X: hard coding

時間のかかる処理 progressbar/tqdm

logger tee
