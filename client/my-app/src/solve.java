import java.util.*;

class solve
{   
    public static void func(int n,List<List<Integer>>res,List<Integer>li,boolean visited[])
    {
        if(li.size()==n) 
        {
            res.add(new ArrayList<>(li));
            return ;
        }
        for(int i=1;i<=n;i++)
        {
            if(!visited[i])
            {
            visited[i]=true;
            li.add(i);
            func(n,res,li,visited);
            li.remove(li.size()-1);
            visited[i]=false;
            }
        }
    }
    
    public static void main(String[] args)
    {
       int n=3;
       List<List<Integer>>li=new ArrayList<>();
       boolean visited[]=new boolean [n+1];
       Arrays.fill(visited,false);
       func(3,li,new ArrayList<>(),visited);
       for(int i=0;i<li.size();i++)
       {
        System.out.println(li.get(i));
       }  
    }
}