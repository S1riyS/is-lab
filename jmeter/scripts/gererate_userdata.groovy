def threadNum = ctx.getThreadNum()
def uniqueTime = System.currentTimeMillis()

vars.put("user_name", "user_${threadNum}_${uniqueTime}")