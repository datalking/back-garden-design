/**
 * based on react-motion's mergeDiff algorithm
 * @param currNodeKeys 如[]
 * @param currKeyIndex 如{}
 * @param nextNodeKeys 如['$$key$$']
 * @param nextKeyIndex 如{$$key$$:0}
 */
function mergeKeys(currNodeKeys, currKeyIndex, nextNodeKeys, nextKeyIndex) {
  console.log('====mergeKeys params:');
  // console.log(currNodeKeys);
  // console.log(currKeyIndex);
  // console.log(nextNodeKeys);
  // console.log(nextKeyIndex);

  // 最后会返回排序后的key数组集合
  const allKeys = [];

  // 遍历待更新key，拷贝到集合
  for (let i = 0; i < nextNodeKeys.length; i++) {
    allKeys[i] = nextNodeKeys[i];
  }

  // 遍历已有key，若已有key在待更新key中不存在，则加入集合
  for (let i = 0; i < currNodeKeys.length; i++) {
    if (nextKeyIndex[currNodeKeys[i]] === undefined) {
      allKeys.push(currNodeKeys[i]);
    }
  }

  // 返回排序后的key数组集合
  return allKeys.sort((a, b) => {
    // 取出各key的索引
    const nextOrderA = nextKeyIndex[a];
    const nextOrderB = nextKeyIndex[b];
    const currOrderA = currKeyIndex[a];
    const currOrderB = currKeyIndex[b];

    // 若索引在待更新key中都存在，则直接比较大小
    if (nextOrderA !== null && nextOrderB !== null) {
      return nextKeyIndex[a] - nextKeyIndex[b];
    } else if (currOrderA !== null && currOrderB !== null) {
      // 若索引在已有key中都存在，则直接比较大小

      return currKeyIndex[a] - currKeyIndex[b];
    } else if (nextOrderA !== null) {
      // 若索引有一个不存在，且nextOrderA存在

      // 遍历待更新集key
      for (let i = 0; i < nextNodeKeys.length; i++) {
        const pivot = nextNodeKeys[i];

        // 若待更新key不存在于已有key中，则跳过本次循环继续遍历
        if (!currKeyIndex[pivot]) {
          continue;
        }

        // 若待更新key存在于已有key，则比较
        if (nextOrderA < nextKeyIndex[pivot] && currOrderB > currKeyIndex[pivot]) {
          return -1;
        } else if (nextOrderA > nextKeyIndex[pivot] && currOrderB < currKeyIndex[pivot]) {
          return 1;
        }
      }

      // 按原序返回[a,b]
      return 1;
    }

    // 若索引有一个不存在，且nextOrderA不存在
    for (let i = 0; i < nextNodeKeys.length; i++) {
      const pivot = nextNodeKeys[i];

      // 若待更新key不存在于已有key中，则跳过本次循环继续遍历
      if (!currKeyIndex[pivot]) {
        continue;
      }

      if (nextOrderB < nextKeyIndex[pivot] && currOrderA > currKeyIndex[pivot]) {
        return 1;
      } else if (nextOrderB > nextKeyIndex[pivot] && currOrderA < currKeyIndex[pivot]) {
        return -1;
      }
    }

    return -1;
  });
}

export default mergeKeys;
