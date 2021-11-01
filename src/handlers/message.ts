import Context from '@/models/Context'

function cutMessage(str: string, ctx: Context): string[] {
  /** Making copiable, trimming, and pushing to tweets array */
  function preapareAndPush(str: string): void {
    tweets.push(makeCopyable(str.trim()))
  }

  const sentenses = str.split('.')
  const tweets = []
  preapareAndPush(
    sentenses.reduce((acc, curr) => {
      if (!curr.trim().length) {
        return acc
      }

      if (curr.length > 280) {
        acc.length && preapareAndPush(acc)
        tweets.push(ctx.i18n.t('cannot_cut'))
        return curr + '.'
      }

      const newStr = acc + curr
      if (newStr.length >= 280) {
        preapareAndPush(acc)
        return curr + '.'
      }

      return newStr + '.'
    }, '')
  )

  return tweets
}

function prepareMessages(arr: string[], ctx: Context): string[] {
  let resultArray = []
  arr.forEach((str) => {
    if (str.length <= 280) {
      resultArray.push(makeCopyable(str))
    } else {
      resultArray = resultArray.concat(cutMessage(str, ctx))
    }
  })

  return resultArray
}

function makeCopyable(str: string): string {
  return '<code>' + str + '</code>'
}

async function sendMessagesFromArray(arr: string[], ctx: Context) {
  for (const str of arr) {
    await ctx.reply(str, {
      parse_mode: 'HTML',
    })
  }
}

export default function sendMessage(ctx: Context) {
  return sendMessagesFromArray(
    prepareMessages(ctx.message.text.split('\n\n'), ctx),
    ctx
  )
}
